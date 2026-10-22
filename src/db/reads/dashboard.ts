import { cache } from "react";
import type { BarData } from "@/components/dashboard/BarActions";
import { hostNotices, needsWaiting } from "@/components/dashboard/notices";
import { loadRecentReplies } from "@/db/reads/activity";
import { loadHostEvents } from "@/db/reads/events";
import { loadGuests } from "@/db/reads/guests";
import { loadHost, type Host } from "@/db/reads/host";
import { awaitingPayment } from "@/lib/packages";
import { buildRows, countRows } from "@/lib/guests";
import type {
  AttentionNotice,
  DashboardEvent,
  RsvpActivity,
} from "@/types/dashboard";

/** The latest replies the side panel lists, across every event. */
const LATEST_REPLIES = 20;

export interface HostDashboard {
  host: Host;
  events: DashboardEvent[];
  notices: AttentionNotice[];
  /** Waiting for payment: what sits in the cart. */
  unpaid: DashboardEvent[];
  activity: RsvpActivity[];
  /** The strip's and the landing bar's initials and counts. */
  bar: BarData;
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

/** Everything the dashboard's shell and Home read, once per request. */
export const loadDashboard = cache(async (): Promise<HostDashboard> => {
  const [host, events] = await Promise.all([loadHost(), loadHostEvents()]);
  const [waiting, activity] = await Promise.all([
    waitingCounts(events),
    loadRecentReplies(events, LATEST_REPLIES),
  ]);
  const notices = hostNotices(events, waiting);
  const unpaid = events.filter(awaitingPayment);
  return {
    host,
    events,
    notices,
    unpaid,
    activity,
    bar: {
      initials: host.initials,
      cart: unpaid.length,
      alerts: notices.length,
    },
  };
});
