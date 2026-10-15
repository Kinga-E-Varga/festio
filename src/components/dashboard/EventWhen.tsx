import { useLocale } from "next-intl";
import { formatDay, formatRelative } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/** When the event is — its day, then how far off — the way the events list says it. */
export function EventWhen({
  event,
  className = "mt-2.5",
}: {
  event: DashboardEvent;
  /** Its spacing: under a title by default, over one on the cards. */
  className?: string;
}) {
  const locale = useLocale();

  return (
    <p className={`text-[14px] leading-none text-neutral-800 ${className}`}>
      <span className="font-medium text-neutral-950">
        {formatDay(event.date, locale)}
      </span>
      <span aria-hidden="true">{" · "}</span>
      <span className="text-neutral-800">
        {formatRelative(event.countdown, locale)}
      </span>
    </p>
  );
}
