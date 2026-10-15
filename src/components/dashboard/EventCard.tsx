import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { EventWhen } from "@/components/dashboard/EventWhen";
import { RepliesSummary } from "@/components/dashboard/RepliesSummary";
import { ShareFields } from "@/components/dashboard/ShareFields";
import { TodoBoard } from "@/components/dashboard/TodoBoard";
import { noticesFor } from "@/components/dashboard/notices";
import { Icon } from "@/components/icons";
import { isPast } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * What says the card opens, where nothing hovers: a round arrow. With a
 * pointer it fills and nudges along as the card lifts.
 */
function OpenArrow({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none size-[34px] items-center justify-center rounded-full border border-neutral-400 bg-neutral-100 text-neutral-700 transition-colors group-hover/card:border-primary-800 group-hover/card:bg-primary-800 group-hover/card:text-neutral-50 ${className}`}
    >
      <Icon
        name="arrowRight"
        className="size-4 transition-transform group-hover/card:translate-x-px"
        strokeWidth={2}
      />
    </span>
  );
}

/**
 * The card's one spacing: its padding all round, and every step between and
 * inside its sections. A wide card breathes.
 */
const PAD = "px-6 py-7 @min-[700px]:p-8";
const GAP = "gap-7 @min-[700px]:gap-8";

export function EventCard({ event }: { event: DashboardEvent }) {
  /* Past and past its retention date: the record is a stub, not a tool. */
  const archived = isPast(event) && event.dataDeleted;
  const t = useTranslations("Event");
  const hasTodos = !archived && noticesFor(event.id).length > 0;

  return (
    /*
     * Hover lifts the card and is carried by the shadow rather than by a
     * fill: the card's own ground is how the pile reads at a glance, and it
     * may not move under the pointer. The whole card is a link.
     */
    <article className="group/card relative h-full rounded-ui border border-neutral-400 bg-neutral-50 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover has-[a[data-card]:active]:bg-neutral-100">
      {/*
       * The card's own link, laid over all of it. It sits on the card itself,
       * not in the title: each section is a box of its own, so a link
       * stretched from inside one would cover only that section. Only the share
       * fields sit above it. Touch has no hover, so a press darkens the card
       * instead.
       */}
      <Link
        href={`/dashboard/events?event=${event.id}#focus`}
        data-card
        className="absolute inset-0 z-[5] rounded-ui"
      >
        <span className="sr-only">{event.title}</span>
      </Link>
      {/*
       * The nav and the activity rail both eat into the card's width, so its
       * layout keys off the card itself rather than the viewport.
       */}
      <div className="@container">
        {/*
         * Beside the preview, the arrow takes the top-right corner, 16 in
         * from both edges at every width. Stacked, it moves in with the title.
         */}
        <OpenArrow className="absolute top-4 right-4 hidden @min-[566px]:flex" />
        {/*
         * Up to three sections — the preview, the details and the to-dos —
         * on one grid, in that order:
         *
         * - from 566: the preview and the details side by side, the to-dos in
         *   a full row below;
         * - under 566, stacked: the date and title lead, then the preview,
         *   the rest of the details and the to-dos. The details give up their
         *   own box here, so their two halves sit in the grid either side of
         *   the preview.
         *
         * Side by side, every section centres on the others. The grid sits at
         * the top of a card stretched by its neighbours in the pile, so the
         * sections of cards in one row start on one line.
         */}
        <div
          className={`grid grid-cols-1 ${GAP} ${PAD} @min-[566px]:grid-cols-[auto_minmax(0,1fr)]`}
        >
          {/*
           * The preview alone. Side by side, it has one fixed size, so cards
           * in the pile line up column for column: as tall as the details —
           * date, title, replies with their legend wrapped to a second line
           * ("x more expected", 4 + 19), link and password, with the steps
           * between — plus 8 above and below, as on the event rows. On one
           * legend line the details sit about 20 inside its top and foot. As wide as an
           * invitation's 7 : 10 makes it.
           * A preview of another shape is cropped to fit, never letterboxed.
           * Stacked, it takes the width instead, capped at 240.
           */}
          <div className="relative order-2 aspect-[7/10] w-full max-w-[240px] justify-self-center overflow-hidden rounded-ui border border-neutral-400 bg-neutral-50 @min-[566px]:order-none @min-[566px]:h-[252px] @min-[566px]:w-auto @min-[566px]:max-w-none @min-[566px]:self-center @min-[672px]:h-[254px] @min-[700px]:h-[270px]">
            <Image
              src={event.preview}
              alt={t("previewAlt", { title: event.title })}
              fill
              sizes="240px"
              className="object-cover object-top"
            />
          </div>

          {/*
           * The details, one step apart. The date is the exception: it
           * belongs to the title, so it sits closer, 10px above it. Beside
           * the preview their three rows — date and title, replies, link —
           * spread evenly down its height, 16 inside its top and foot; with
           * no room to spare they close up to 16 apart.
           */}
          <div
            className={`contents @min-[566px]:flex @min-[566px]:min-w-0 @min-[566px]:flex-col @min-[566px]:justify-between @min-[566px]:gap-4 @min-[566px]:self-stretch @min-[566px]:py-4`}
          >
            {/*
             * Stacked, the arrow sits beside the date and title, centred on
             * them, so the title never runs under it.
             */}
            <div className="order-1 flex items-center gap-5 @min-[566px]:order-none @min-[566px]:block">
              <div className="min-w-0 flex-1">
                {/*
                 * Beside the preview, the corner arrow's footprint kept free
                 * down past the title's first line: those lines wrap early,
                 * the rest run full width.
                 */}
                <span
                  aria-hidden="true"
                  className="float-right hidden h-[46px] w-12 @min-[566px]:block"
                />
                <EventWhen event={event} className="mb-2.5" />

                {/* One line at every width; a longer title ends in an ellipsis. */}
                <h3 className="line-clamp-1 font-serif text-[20px] leading-[1.2] text-neutral-950 @2xl:text-[22px]">
                  {event.title}
                </h3>
              </div>
              <OpenArrow className="flex shrink-0 @min-[566px]:hidden" />
            </div>

            {archived ? null : (
              /*
               * How the replies stand, right under the title, then the link
               * they come through. Capped, so the bar is never longer than its
               * numbers need.
               */
              <div
                className={`order-3 flex flex-col @min-[566px]:contents ${GAP}`}
              >
                <RepliesSummary event={event} className="max-w-[640px]" />
                <ShareFields event={event} className="relative z-10" />
              </div>
            )}
          </div>

          {/*
           * The to-dos close the card: always a full row under the rest. An
           * event with nothing to do has none.
           */}
          {hasTodos ? (
            <TodoBoard
              event={event}
              className="order-4 @min-[566px]:order-none @min-[566px]:col-span-2"
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
