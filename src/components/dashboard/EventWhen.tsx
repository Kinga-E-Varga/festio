import { useLocale } from "next-intl";
import { formatDay, formatRelative } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/** When the event is — its day, then how far off — the way the events list says it. */
export function EventWhen({ event }: { event: DashboardEvent }) {
  const locale = useLocale();

  return (
    <p className="mt-2.5 text-[14px] leading-none text-neutral-900">
      <span className="font-medium">{formatDay(event.date, locale)}</span>
      <span aria-hidden="true" className="text-neutral-700">
        {" · "}
      </span>
      <span
        className={
          event.isNextUp
            ? "font-medium text-terracotta-600"
            : "text-neutral-700"
        }
      >
        {formatRelative(event.countdown, locale)}
      </span>
    </p>
  );
}
