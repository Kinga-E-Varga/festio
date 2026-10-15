import type { ReactNode } from "react";
import { BackButton } from "@/components/dashboard/BackButton";
import { EventWhen } from "@/components/dashboard/EventWhen";
import type { DashboardEvent } from "@/types/dashboard";

interface EventHeaderProps {
  event: DashboardEvent;
  /** The page's one action, beside the title — it drops under it when there's no room. */
  action?: ReactNode;
}

/** The way back, the event's name and when it is — every event page opens so. */
export function EventHeader({ event, action }: EventHeaderProps) {
  return (
    <>
      {/* The way back doubles as the page's eyebrow. */}
      <BackButton />

      {/* Laid out like the dashboard's greeting and its "New event". */}
      <div className="mt-4 mb-5 flex flex-wrap items-start gap-x-6 gap-y-4 @min-[520px]:items-center">
        <div className="min-w-0 flex-1 @max-[520px]:basis-full">
          <h1 className="mb-3 font-serif text-[26px] leading-[1.08] text-balance text-neutral-950 @min-[720px]:text-[32px]">
            {event.title}
          </h1>

          {/* When it is, said the way the events list says it. */}
          <EventWhen event={event} />
        </div>
        {action}
      </div>
    </>
  );
}
