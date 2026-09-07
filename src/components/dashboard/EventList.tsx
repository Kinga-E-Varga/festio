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
      <p className="rounded-lg border border-dashed border-stone-400 bg-cream-50 px-4 py-10 text-center text-stone-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
