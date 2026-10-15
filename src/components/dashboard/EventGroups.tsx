import { EventRow } from "@/components/dashboard/EventRow";
import { eventStatus, orderEvents } from "@/lib/event";
import type { DashboardEvent, EventStatus } from "@/types/dashboard";

/** The piles, in the order they are listed. */
const GROUPS: EventStatus[] = ["active", "draft", "past"];

interface EventGroupsProps {
  events: DashboardEvent[];
  /** Which piles this tab shows; the rest are left out entirely. */
  statuses: EventStatus[];
  emptyMessage: string;
}

export function EventGroups({
  events,
  statuses,
  emptyMessage,
}: EventGroupsProps) {
  const groups = GROUPS.filter(
    (status) =>
      statuses.includes(status) &&
      events.some((event) => eventStatus(event) === status),
  );

  if (groups.length === 0) {
    return (
      <p className="rounded-ui border border-dashed border-neutral-400 bg-neutral-50 px-6 py-11 text-center text-[14px] text-neutral-800">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-[60px]">
      {groups.map((status) => (
        <section key={status}>
          {/*
           * Each event is its own card, as on the dashboard. The cards lay
           * themselves out against their own width rather than the viewport —
           * the nav and the activity rail both take width away from it, so the
           * two never agree.
           */}
          <div className="flex flex-col gap-9">
            {orderEvents(
              events.filter((event) => eventStatus(event) === status),
              status,
            ).map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
