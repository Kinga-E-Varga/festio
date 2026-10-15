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
      <p className="rounded-ui border border-dashed border-neutral-400 bg-neutral-50 px-6 py-11 text-center text-[14px] text-neutral-800">
        {emptyMessage}
      </p>
    );
  }

  /*
   * One card per row until the list is wide enough for two. Past that, a
   * single card would only stretch: two side by side each keep the layout
   * that fills them — the preview beside the details, the to-dos below —
   * and a big screen shows more events at once.
   */
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-[28px] @min-[1240px]:grid-cols-2 @min-[1240px]:gap-10">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
