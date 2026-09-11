import { EventRow } from "@/components/dashboard/EventRow";
import type { DashboardEvent, EventStatus } from "@/types/dashboard";

/** Each pile says what being in it means, so the rows need no status badge. */
const GROUPS: { status: EventStatus; caption: string }[] = [
  {
    status: "active",
    caption: "Active — the invitation is live or ready to share",
  },
  { status: "draft", caption: "Drafts — not paid for, never reachable" },
  { status: "past", caption: "Past — closed, kept until the deletion date" },
];

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
    (group) =>
      statuses.includes(group.status) &&
      events.some((event) => event.status === group.status),
  );

  if (groups.length === 0) {
    return (
      <p className="border border-dashed border-mustard-300 bg-mustard-100 px-6 py-11 text-center text-neutral-700">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-[34px]">
      {groups.map((group) => (
        <section key={group.status}>
          <h3 className="mb-2.5 text-[10px] font-semibold tracking-[0.18em] text-mustard-500 uppercase">
            {group.caption}
          </h3>
          {/*
           * The rows lay themselves out against this box rather than the
           * viewport — the nav and the activity rail both take width away
           * from it, so the two never agree.
           */}
          <div className="@container border border-mustard-300 bg-mustard-100">
            {events
              .filter((event) => event.status === group.status)
              .map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
