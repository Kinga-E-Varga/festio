import { getTranslations } from "next-intl/server";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { Link } from "@/i18n/navigation";
import { floodReportPath, repliesPaused } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/** The host hears about replies only once they hit the hidden cap and pause. */
export async function RepliesBanner({ event }: { event: DashboardEvent }) {
  if (!repliesPaused(event)) return null;
  const t = await getTranslations("EventPage");
  const tEvent = await getTranslations("Event");

  return (
    <Banner tone="warn" icon="alert" title={t("pausedTitle")}>
      {t("pausedBody")}{" "}
      <Link
        href={floodReportPath(event)}
        className="font-semibold underline underline-offset-[3px] transition-colors hover:text-neutral-950"
      >
        {tEvent("reportFlood")}
      </Link>
    </Banner>
  );
}
