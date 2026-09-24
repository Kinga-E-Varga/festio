import { getTranslations } from "next-intl/server";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { Link } from "@/i18n/navigation";
import {
  canReportFlood,
  expectedLevel,
  expectedPercent,
  floodReportPath,
  repliesPaused,
} from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

interface RepliesBannerProps {
  event: DashboardEvent;
  /** The editor warns from the warning level; the guest list only from 100%. */
  from: "warn" | "over";
}

/** One replies banner at most: paused says everything the others do. */
export async function RepliesBanner({ event, from }: RepliesBannerProps) {
  const t = await getTranslations("EventPage");
  const tEvent = await getTranslations("Event");
  /* Offered from 100% of expected guests, under whichever banner shows. */
  const report = canReportFlood(event) ? (
    <>
      {" "}
      <Link
        href={floodReportPath(event)}
        className="font-semibold underline underline-offset-[3px] transition-colors hover:text-neutral-900"
      >
        {tEvent("reportFlood")}
      </Link>
    </>
  ) : null;
  const replies = {
    replied: event.rsvp.replied,
    expected: event.expectedGuests,
    percent: expectedPercent(event.rsvp.replied, event.expectedGuests),
  };
  const level = expectedLevel(replies.percent);
  const near = from === "warn" ? level !== "ok" : level === "over";

  if (repliesPaused(event)) {
    return (
      <Banner tone="warn" icon="alert" title={t("pausedTitle")}>
        {t("pausedBody")}
        {report}
      </Banner>
    );
  }
  if (replies.replied > replies.expected) {
    return (
      <Banner tone="warn" icon="guests" title={t("overExpectedTitle")}>
        {t("overExpectedBody", replies)}
        {report}
      </Banner>
    );
  }
  if (replies.replied > 0 && near) {
    return (
      <Banner tone="warn" icon="guests" title={t("nearExpectedTitle", replies)}>
        {t("nearExpectedBody", replies)}
        {report}
      </Banner>
    );
  }
  return null;
}
