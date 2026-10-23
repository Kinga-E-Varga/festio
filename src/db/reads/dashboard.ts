import { cache } from "react";
import type { BarData } from "@/components/dashboard/BarActions";
import { hostNotices, needsWaiting } from "@/components/dashboard/notices";
import { loadRecentReplies, newReplyCount } from "@/db/reads/activity";
import { loadHostEvents } from "@/db/reads/events";
import { loadGuests } from "@/db/reads/guests";
import { loadHost, type Host } from "@/db/reads/host";
import { buildRows, countRows } from "@/lib/guests";
import type {
  AttentionNotice,
  DashboardEvent,
  RsvpActivity,
} from "@/types/dashboard";

/** The latest replies the side panel lists, across every event. */
const LATEST_REPLIES = 20;

export interface HostSummary {
  host: Host;
  events: DashboardEvent[];
  notices: AttentionNotice[];
  /** The strip's and the landing bar's initials and counts. */
  bar: BarData;
}

export interface HostDashboard extends HostSummary {
  activity: RsvpActivity[];
}

/** Who on the list hasn't replied yet, read only for the events whose notice names them. */
async function waitingCounts(
  events: DashboardEvent[],
): Promise<Record<string, number>> {
  const counted = await Promise.all(
    events.filter(needsWaiting).map(async (event) => {
      const rows = buildRows(await loadGuests(event), event.preloaded);
      return [event.id, countRows(rows).waiting] as const;
    }),
  );
  return Object.fromEntries(counted);
}

/** The host, their events and what needs them, without the latest replies: the landing bar's read. */
export const loadHostSummary = cache(async (): Promise<HostSummary> => {
  const [host, events] = await Promise.all([loadHost(), loadHostEvents()]);
  const [waiting, replies] = await Promise.all([
    waitingCounts(events),
    newReplyCount(events, host.lastVisit),
  ]);
  const notices = hostNotices(events, waiting);
  return {
    host,
    events,
    notices,
    bar: {
      initials: host.initials,
      alerts: notices.length,
      replies,
    },
  };
});

/** Everything the dashboard's shell and Home read, once per request. */
export const loadDashboard = cache(async (): Promise<HostDashboard> => {
  /* Both start from the host's events, read once (`cache`), so they run side by side. */
  const [summary, activity] = await Promise.all([
    loadHostSummary(),
    loadHostEvents().then((events) =>
      loadRecentReplies(events, LATEST_REPLIES),
    ),
  ]);
  return { ...summary, activity };
});
