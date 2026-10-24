import { cache } from "react";
import type { BarData } from "@/components/dashboard/BarActions";
import { hostNotices } from "@/components/dashboard/notices";
import { newReplyCount } from "@/db/reads/activity";
import { loadHostEvents } from "@/db/reads/events";
import { loadHost, type Host } from "@/db/reads/host";
import type { AttentionNotice, DashboardEvent } from "@/types/dashboard";

export interface HostSummary {
  host: Host;
  events: DashboardEvent[];
  notices: AttentionNotice[];
  /** The strip's and the landing bar's initials and counts. */
  bar: BarData;
}

/**
 * The host, their events and what needs them, once per request: the
 * dashboard's shell and Home, and the landing bar. Not the latest replies:
 * their panel asks for them when it opens (`loadLatestReplies`).
 */
export const loadHostSummary = cache(async (): Promise<HostSummary> => {
  const [host, events] = await Promise.all([loadHost(), loadHostEvents()]);
  const replies = await newReplyCount(events, host.lastVisit);
  const notices = hostNotices(events);
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
