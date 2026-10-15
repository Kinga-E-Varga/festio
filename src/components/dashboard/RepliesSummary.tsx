import { useTranslations } from "next-intl";
import { STRONG_TEXT } from "@/components/dashboard/styles";
import { expectedPercent, repliesBarVars } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/** The legend's dots: the bar's two fills, then its empty track. */
const SWATCH = {
  attending: "bg-primary-700",
  declined: "bg-warning-400",
  /* The empty track: the expected guests still to reply. */
  stillExpected: "border border-neutral-400 bg-neutral-200",
} as const;

/**
 * How the replies stand against expected guests: the count, one bar of
 * coming, not coming and still expected, and a legend under it. Shared by the
 * dashboard's cards and the events list.
 */
export function RepliesSummary({
  event,
  className,
}: {
  event: DashboardEvent;
  className?: string;
}) {
  const t = useTranslations("Event");
  const expected = event.expectedGuests;
  const replied = event.rsvp.replied;
  const percent = expectedPercent(replied, expected);
  /* The third item is what is left of expected guests, or how far past it. */
  const legend = [
    {
      key: "legendComing",
      count: event.rsvp.attending,
      swatch: SWATCH.attending,
    },
    {
      key: "legendNotComing",
      count: event.rsvp.declined,
      swatch: SWATCH.declined,
    },
    ...(replied > expected
      ? [{ key: "legendOverExpected", count: replied - expected, swatch: null }]
      : replied < expected
        ? [
            {
              key: "legendStillExpected",
              count: expected - replied,
              swatch: SWATCH.stillExpected,
            },
          ]
        : []),
  ] as const;
  const barVars = repliesBarVars(event);

  return (
    <div className={className}>
      <p className="mb-3 text-[12.5px] text-neutral-800">
        {t.rich("repliedOfExpected", {
          replied,
          expected,
          percent,
          big: (chunks) => (
            <span className="mr-0.5 font-serif text-[22px] leading-none text-neutral-950 tabular-nums">
              {chunks}
            </span>
          ),
        })}
      </p>

      <div
        role="img"
        aria-label={t("barAria", {
          attending: event.rsvp.attending,
          declined: event.rsvp.declined,
          expected,
        })}
        className="replies-bar h-2.5 gap-0.5 bg-neutral-50"
        style={barVars}
      >
        {/*
         * Each part apart from the next by a sliver of the card, the
         * track drawn as a part of its own. An empty part is left out,
         * so no gap doubles up.
         */}
        {event.rsvp.attending > 0 ? (
          <span aria-hidden="true" className="attending" />
        ) : null}
        {event.rsvp.declined > 0 ? (
          <span aria-hidden="true" className="declined" />
        ) : null}
        {replied < expected ? (
          <span aria-hidden="true" className="flex-1 bg-neutral-200" />
        ) : null}
      </div>

      {/*
       * What the bar's colours stand for, measured like the bar against
       * expected guests: the track is those still expected to reply.
       * Past expected the bar is full, so the overflow takes no colour.
       */}
      <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-neutral-800">
        {legend.map(({ key, count, swatch }) => (
          <li key={key} className="flex items-center gap-1.5">
            {swatch ? (
              <span
                aria-hidden="true"
                className={`size-2.5 shrink-0 rounded-full ${swatch}`}
              />
            ) : null}
            <span>
              {t.rich(key, {
                count,
                b: (chunks) => <b className={STRONG_TEXT}>{chunks}</b>,
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
