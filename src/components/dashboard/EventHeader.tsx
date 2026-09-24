import { getLocale } from "next-intl/server";
import { BackButton } from "@/components/dashboard/BackButton";
import { formatDay, formatRelative } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

interface EventHeaderProps {
  event: DashboardEvent;
}

/** The way back, the event's name and when it is — every event page opens so. */
export async function EventHeader({ event }: EventHeaderProps) {
  const locale = await getLocale();

  return (
    <>
      {/* The way back doubles as the page's eyebrow. */}
      <BackButton />

      <h1 className="mt-[18px] font-serif text-[29px] leading-[1.08] text-balance text-neutral-900 @min-[720px]:text-[38px]">
        {event.title}
      </h1>

      {/* When it is, said the way the events list says it. */}
      <p className="mt-2.5 mb-3 text-[14px] leading-none text-neutral-900">
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
    </>
  );
}
