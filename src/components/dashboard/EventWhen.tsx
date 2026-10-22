import { useLocale } from "next-intl";
import { formatDay, formatRelative } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/** When the event is — its day, then how far off — as a box's line: the Overview's event box. */
export function EventWhen({
  event,
}: {
  event: Pick<DashboardEvent, "date" | "countdown">;
}) {
  const locale = useLocale();

  return (
    <p className="body-text leading-[1.4]">
      <span className="strong-text">{formatDay(event.date, locale)}</span>
      <span aria-hidden="true">{" · "}</span>
      {formatRelative(event.countdown, locale)}
    </p>
  );
}
