import { groups, scheduleDay, timeParts } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import {
  BODY_SM,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  TIME_TEXT,
} from "@/modular/styles";
import type { Language } from "@/lib/language";
import type { Group, VariantProps } from "@/types/modular";
import { clockTone } from "./ClockEvents";

/* Two equal columns either side of the card's middle. */
const HALVES = "grid grid-cols-2 items-center gap-x-4 @3xl:gap-x-6";

/**
 * Icon & list's (`2`) days as a full card (`FullCard`): the heading
 * centred, the days under it between the card's lines, a line across the
 * card between each. Each event split at the card's middle: its time on one side, in
 * its day's colour, its title and note on the other, each side leaning
 * on the middle. The events take turns, on across the days: the 1st's
 * time on the left, the 2nd's on the right, and so on. A day's date
 * centred over its events, in its day's colour, only when there is more
 * than one day. Am or pm under the clock on a phone, beside it from
 * `@3xl`.
 */
export function Variant({ values, language, ground }: VariantProps) {
  const days = groups(values, "days");
  if (days.length === 0) return null;
  // Each day's first event, counted from the start.
  const firstEvent = days.map((_, index) =>
    days.slice(0, index).reduce((total, day) => total + day.items.length, 0),
  );

  return (
    <FullCard values={values} ground={ground}>
      <ol className="divide-y-1 divide-[var(--m-line)] py-4 @3xl:py-6">
        {days.map((day, index) => (
          <li key={index} className="pt-4 pb-3">
            <Day
              day={day}
              date={
                days.length > 1
                  ? scheduleDay(day.values.date ?? "", language)
                  : ""
              }
              tone={clockTone(index)}
              first={firstEvent[index]}
              language={language}
            />
          </li>
        ))}
      </ol>
    </FullCard>
  );
}

/** One day: its date centred, then its events, each split at the middle. */
function Day({
  day,
  date,
  tone,
  first,
  language,
}: {
  day: Group;
  date: string;
  tone: string;
  /** The day's first event, counted from the start: who takes which side. */
  first: number;
  language: Language;
}) {
  return (
    <>
      {date ? (
        <p className={`${INNER_EYEBROW} mb-1 text-center ${tone}`}>{date}</p>
      ) : null}
      {day.items.length > 0 ? (
        <ul>
          {day.items.map((event, eventIndex) => {
            const { clock, meridiem } = timeParts(event.time, language);
            const flipped = (first + eventIndex) % 2 === 1;
            return (
              <li key={eventIndex} className={`${HALVES} py-5`}>
                {/* Each side leans on the middle: right-aligned on the left, left-aligned on the right. */}
                <span
                  className={`flex flex-col @3xl:flex-row @3xl:gap-x-[0.3ch] ${flipped ? "order-2 items-start text-left @3xl:justify-start" : "items-end text-right @3xl:justify-end"} ${TIME_TEXT} ${tone}`}
                >
                  <span>{clock}</span>
                  {meridiem ? <span>{meridiem}</span> : null}
                </span>
                <div
                  className={`min-w-0 ${flipped ? "order-1 text-right" : ""}`}
                >
                  <h3 className={ITEM_TITLE}>{event.title}</h3>
                  {event.note ? (
                    <p className={`${BODY_SM} ${MUTED} mt-1`}>{event.note}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </>
  );
}
