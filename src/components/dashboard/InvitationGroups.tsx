import { InvitationCard } from "@/components/dashboard/InvitationCard";
import { orderEvents } from "@/lib/event";
import type { DashboardEvent, EventStatus } from "@/types/dashboard";

/** Each pile says what being in it means, so the cards need no status badge. */
const GROUPS: { status: EventStatus; caption: string }[] = [
  { status: "active", caption: "Active — the invitation is visible to guests" },
  {
    status: "draft",
    caption: "Drafts — hidden or not paid for, never reachable",
  },
  { status: "past", caption: "Past — closed, kept until the deletion date" },
];

interface InvitationGroupsProps {
  events: DashboardEvent[];
  /** Which piles this tab shows; the rest are left out entirely. */
  statuses: EventStatus[];
  emptyMessage: string;
}

export function InvitationGroups({
  events,
  statuses,
  emptyMessage,
}: InvitationGroupsProps) {
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
    <div className="flex flex-col gap-[60px]">
      {groups.map((group) => (
        <section key={group.status}>
          <h3 className="mb-2.5 text-[10px] font-semibold tracking-[0.18em] text-mustard-500 uppercase">
            {group.caption}
          </h3>
          {/*
           * Portrait cards, on the events list's own card gap. Each step is
           * the content width at which that many cards still clear ~300px
           * apiece — what a portrait preview and a 135px button both need.
           * They lay themselves out against the content's width rather than
           * the viewport: the nav and the activity rail both take width away
           * from it, so the two never agree.
           */}
          <div className="grid grid-cols-1 gap-[28px] @min-[640px]:grid-cols-2 @min-[1000px]:grid-cols-3">
            {orderEvents(
              events.filter((event) => event.status === group.status),
              group.status,
            ).map((event) => (
              <InvitationCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
