import { useLocale, useTranslations } from "next-intl";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { PAGE_BOX } from "@/components/dashboard/styles";
import { Link } from "@/i18n/navigation";
import { eventPath, formatDay, formatDuration } from "@/lib/event";
import type { Language } from "@/lib/language";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * How far off the soonest upcoming event is ("Next event in" over "2 days",
 * or Today); the whole box opens its Overview.
 */
export function NextEventCard({ event }: { event?: DashboardEvent }) {
  const t = useTranslations("Dashboard");
  const tNav = useTranslations("Nav");
  const tEvent = useTranslations("Event");
  const locale = useLocale() as Language;

  if (!event) {
    return (
      <section className={PAGE_BOX}>
        <BoxHead title={t("nextEvent")} />
        <p className="muted-text">{tNav("noUpcoming")}</p>
      </section>
    );
  }

  const today = event.countdown.value === 0;

  return (
    <Link
      href={eventPath(event.id)}
      className={`block transition-colors hover:border-neutral-400 ${PAGE_BOX}`}
    >
      <BoxHead title={today ? t("nextEvent") : t("nextEventIn")} as="span" />
      <span className="block display-number">
        {today
          ? tEvent("today")
          : t("countdown", { time: formatDuration(event.countdown, locale) })}
      </span>
      <span className="mt-3 block meta-text leading-[1.4]">{event.title}</span>
      <span className="block meta-text leading-[1.4]">
        {formatDay(event.date, locale)}
      </span>
    </Link>
  );
}
