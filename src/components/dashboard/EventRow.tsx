import Image from "next/image";
import Link from "next/link";
import { EventMeta } from "@/components/dashboard/EventMeta";
import { Icon } from "@/components/icons";
import { deletionDate, formatEventDate } from "@/lib/event";
import type { DashboardEvent, EventStatus } from "@/types/dashboard";

/** The row's left edge says which pile the event is in, as the card's does. */
const STATUS_EDGE: Record<EventStatus, string> = {
  active: "border-l-forest-500",
  draft: "border-l-terracotta-500",
  past: "border-l-neutral-600",
};

/*
 * A closed event has nothing to act on, so it gets no hover cue either.
 * Everything else lifts a shade to say the row leads somewhere.
 */
const HOVER = "transition-colors hover:bg-mustard-50";

const BUTTON =
  "flex items-center justify-center gap-2 rounded-md px-4 py-2.5 font-medium transition-colors";
const PRIMARY = `${BUTTON} border border-forest-500 bg-forest-500 text-neutral-50 hover:border-forest-600 hover:bg-forest-600`;
/* The outlined action borrows the solid one's fill for its edge. */
const GHOST = `${BUTTON} border border-forest-500 bg-transparent text-forest-500 hover:border-forest-600 hover:bg-mustard-50 hover:text-forest-600`;

/** How many have replied, on the line under the tags. */
function Replies({ event }: { event: DashboardEvent }) {
  if (event.rsvp.invited === 0) {
    return (
      <p className="mt-2.5 text-[12.5px] leading-[1.4] text-neutral-700">
        Not shared yet
      </p>
    );
  }

  return (
    <p className="mt-2.5 text-[12.5px] leading-[1.4] text-neutral-700">
      <span className="align-[-1px] font-serif text-[17px] text-neutral-900 tabular-nums">
        {event.rsvp.replied}
      </span>{" "}
      {event.rsvp.replied === 1 ? "reply" : "replies"}
    </p>
  );
}

export function EventRow({ event }: { event: DashboardEvent }) {
  const deletion = formatEventDate(deletionDate(event.date));

  return (
    /*
     * The preview sits beside everything the event says about itself — date,
     * title, tags and how many have replied. The actions drop below that pair
     * until the row can hold them alongside without squeezing the title, at
     * 720px of row rather than of viewport: the nav and the rail both eat into
     * it, so the two never agree.
     *
     * Wide rows cap the middle column rather than letting it stretch, so the
     * actions stay near what they act on instead of drifting to the far edge.
     */
    <div
      className={`grid grid-cols-[88px_minmax(0,1fr)] items-center gap-x-4 gap-y-3.5 border-t border-mustard-300 border-l-4 px-4 py-3.5 first:border-t-0 @min-[720px]:grid-cols-[89px_minmax(0,920px)_minmax(280px,1fr)] @min-[720px]:gap-x-5 @min-[720px]:px-5 @min-[720px]:py-4 ${
        STATUS_EDGE[event.status]
      } ${event.status === "past" ? "" : HOVER}`}
    >
      <div className="col-start-1 row-start-1 h-[124px] self-start bg-neutral-50 @min-[720px]:row-span-2 @min-[720px]:h-[126px] @min-[720px]:w-[89px] @min-[720px]:self-center">
        <Image
          src={event.preview}
          alt=""
          sizes="89px"
          className="size-full object-cover"
        />
      </div>

      <div className="col-start-2 row-start-1 min-w-0 @min-[720px]:row-span-2 @min-[720px]:self-center">
        <p className="mb-[7px] text-[12.5px] leading-none text-neutral-700">
          <span className="font-medium text-neutral-900">
            {event.dateLabel}
          </span>
          <span aria-hidden="true">{" · "}</span>
          <span
            className={event.isNextUp ? "font-medium text-terracotta-600" : ""}
          >
            {event.countdownLabel}
          </span>
        </p>

        <h3 className="mb-[9px] font-serif text-[19px] leading-[1.25] text-neutral-900 @min-[560px]:truncate">
          {event.title}
        </h3>

        <EventMeta event={event} />
        {event.status === "past" ? null : <Replies event={event} />}
      </div>

      {event.status === "past" ? (
        <p className="col-span-2 row-start-2 text-[12.5px] leading-[1.4] text-neutral-700 @min-[720px]:col-span-1 @min-[720px]:col-start-3 @min-[720px]:row-span-2 @min-[720px]:row-start-1 @min-[720px]:w-[280px] @min-[720px]:self-center @min-[720px]:text-center">
          {event.dataDeleted
            ? `Guest data deleted on ${deletion}`
            : `Deletion due ${deletion}`}
        </p>
      ) : (
        <div className="col-span-2 row-start-2 flex flex-wrap items-center gap-2 @min-[720px]:col-span-1 @min-[720px]:col-start-3 @min-[720px]:row-span-2 @min-[720px]:row-start-1 @min-[720px]:w-[280px] @min-[720px]:justify-center @min-[720px]:self-center">
          <Link
            href={`/dashboard/events/${event.id}`}
            className={`${PRIMARY} @max-[440px]:flex-1`}
          >
            <Icon name="pencil" className="size-[15px]" />
            Edit event
          </Link>
          <button type="button" className={`${GHOST} @max-[440px]:flex-1`}>
            <Icon name="layers" className="size-[15px]" />
            Invitation
          </button>
        </div>
      )}
    </div>
  );
}
