import { formatTime, groups, scheduleDay } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  columnsFor,
  EYEBROW,
  H3_ITEM,
  MUTED,
  PAD,
  STACK,
  TONE_TEXT,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/*
 * The days' lines when there are several. Stacked (under `@3xl`): a line
 * across above each day after the first, as above the first. Side by side:
 * an upright line between the days, halfway through the 40px between them,
 * 24px clear of the lines on top and below, as `LINED_CELL`'s; each day
 * draws it on its left, and the first column's is cut off
 * (`overflow-hidden` on the list, as `LINED_GRID`).
 */
const MANY_DAYS =
  "overflow-hidden border-y-1 border-[var(--m-line)] pt-6 @3xl:gap-x-0";
const DAY_LINES =
  "border-t-1 border-[var(--m-line)] pt-6 first:border-t-0 first:pt-0 @3xl:relative @3xl:-ml-px @3xl:border-t-0 @3xl:px-5 @3xl:pt-0 @3xl:before:absolute @3xl:before:top-0 @3xl:before:bottom-6 @3xl:before:left-0 @3xl:before:w-px @3xl:before:bg-[var(--m-line)]";

/**
 * The section's heading centred, the eyebrow over it and the note under
 * it — no italic line — and the days under them across the full width,
 * side by side from `@3xl` (`columnsFor`). Each event a centred row, no
 * lines between them: its time as an eyebrow in the secondary over its
 * title and note. No icons by the events. A hairline above each day's rows
 * and, with one day, below them. A day's date stands above its rows in the
 * accent, only when there is more than one day, and then one line runs
 * above all the days and one below, across the full width; stacked, one
 * above each day too, side by side, an upright one between them.
 */
export function Variant({ values, language, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {days.length > 0 ? (
        <ol
          className={`grid w-full gap-10 text-center @3xl:gap-y-12 ${columnsFor(days.length)} ${days.length > 1 ? MANY_DAYS : ""}`}
        >
          {days.map((day, index) => {
            const date = scheduleDay(day.values.date ?? "", language);
            return (
              <li key={index} className={days.length > 1 ? DAY_LINES : ""}>
                {date && days.length > 1 ? (
                  <p className={`${EYEBROW} ${TONE_TEXT.accent} mb-3`}>
                    {date}
                  </p>
                ) : null}
                {day.items.length > 0 ? (
                  <ul className="border-t-1 border-[var(--m-line)]">
                    {day.items.map((event, eventIndex) => (
                      <li
                        key={eventIndex}
                        className={`py-5 ${days.length > 1 ? "" : "last:border-b-1 last:border-[var(--m-line)]"}`}
                      >
                        <p
                          className={`${EYEBROW} ${TONE_TEXT.secondary} mb-4 tabular-nums`}
                        >
                          {formatTime(event.time, language)}
                        </p>
                        <h3 className={H3_ITEM}>{event.title}</h3>
                        {event.note ? (
                          <p className={`${BODY_SM} ${MUTED} mt-1`}>
                            {event.note}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
