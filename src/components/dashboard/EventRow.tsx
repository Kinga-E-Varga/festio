import Image from "next/image";
import Link from "next/link";
import { DatesThatMatter } from "@/components/dashboard/DatesThatMatter";
import { EventMeta } from "@/components/dashboard/EventMeta";
import { RepliesMeter } from "@/components/dashboard/RepliesMeter";
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
const GHOST = `${BUTTON} border border-forest-500 bg-mustard-50 text-forest-500 hover:border-forest-600 hover:bg-forest-200 hover:text-forest-600`;

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
      className={`grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-4 @max-[560px]:grid-cols-1 gap-y-3.5 border-t border-mustard-300 border-l-4 px-4 py-[18px] first:border-t-0 @min-[720px]:grid-cols-[160px_minmax(0,800px)_minmax(190px,1fr)] @min-[720px]:gap-x-[26px] @2xl:px-6 @2xl:py-[22px] ${
        STATUS_EDGE[event.status]
      } ${event.status === "past" ? "" : HOVER}`}
    >
      <div className="col-start-1 row-start-1 h-[156px] self-start bg-neutral-50 @max-[560px]:hidden @min-[720px]:row-span-2 @min-[720px]:h-[228px] @min-[720px]:w-[160px] @min-[720px]:self-center">
        <Image
          src={event.preview}
          alt=""
          sizes="160px"
          className="size-full object-cover"
        />
      </div>

      <div className="col-start-2 row-start-1 min-w-0 @max-[560px]:col-start-1 @min-[720px]:row-span-2 @min-[720px]:self-center">
        <p className="mb-[7px] text-[14px] leading-none font-medium text-neutral-900">
          {event.dateLabel}
        </p>

        <h3 className="mb-[9px] font-serif text-[19px] leading-[1.25] text-neutral-900 @min-[560px]:truncate">
          {event.title}
        </h3>

        <EventMeta event={event} locksIn={false} size="md" />

        {event.status === "past" ? null : (
          <>
            {event.rsvp.invited === 0 ? (
              <p className="mt-5 text-[12.5px] leading-[1.4] text-neutral-700">
                Not shared yet
              </p>
            ) : (
              <div className="mt-5">
                <RepliesMeter
                  replied={event.rsvp.replied}
                  cap={event.safeguard.cap}
                />
              </div>
            )}

            {/* A hairline keeps the deadlines from reading as more reply data. */}
            <div className="mt-5 border-t border-mustard-300 pt-5">
              <DatesThatMatter event={event} layout="row" />
            </div>
          </>
        )}
      </div>

      {event.status === "past" ? (
        <p className="col-span-2 row-start-2 text-[12.5px] leading-[1.4] text-neutral-700 @max-[560px]:col-span-1 @min-[720px]:col-span-1 @min-[720px]:col-start-3 @min-[720px]:row-span-2 @min-[720px]:row-start-1 @min-[720px]:w-[190px] @min-[720px]:justify-self-center @min-[720px]:self-center @min-[720px]:text-center">
          {event.dataDeleted
            ? `Guest data deleted on ${deletion}`
            : `Deletion due ${deletion}`}
        </p>
      ) : (
        <div className="col-span-2 row-start-2 grid grid-cols-2 gap-3.5 @max-[560px]:col-span-1 @max-[560px]:grid-cols-1 @min-[720px]:col-span-1 @min-[720px]:col-start-3 @min-[720px]:row-span-2 @min-[720px]:row-start-1 @min-[720px]:w-[190px] @min-[720px]:grid-cols-1 @min-[720px]:justify-self-center @min-[720px]:self-center">
          <Link href={`/dashboard/events/${event.id}`} className={PRIMARY}>
            <Icon name="pencil" className="size-[15px]" />
            Edit event
          </Link>
          <button type="button" className={GHOST}>
            <Icon name="layers" className="size-[15px]" />
            Edit invitation
          </button>
        </div>
      )}
    </div>
  );
}
