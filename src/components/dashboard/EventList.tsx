import { EventCard } from "@/components/dashboard/EventCard";
import type { DashboardEvent } from "@/types/dashboard";

interface EventListProps {
  events: DashboardEvent[];
  /** Shown instead of the list, and says what to do next. */
  emptyMessage: string;
}

export function EventList({ events, emptyMessage }: EventListProps) {
  if (events.length === 0) {
    return (
      <p className="border border-dashed border-mustard-300 bg-mustard-100 px-6 py-11 text-center text-neutral-700">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
