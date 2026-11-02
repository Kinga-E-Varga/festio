import { groups, scheduleDay, timeParts } from "@/modular/content";
import {
  BODY_SM,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  TIME_TEXT,
  turnTone,
} from "@/modular/styles";
import type { Language } from "@/lib/language";
import type { Group, VariantProps } from "@/types/modular";
import { clockTone } from "./ClockEvents";

/* Two equal columns either side of the middle, nothing between them: the line by the time, the time and the words each 16px from it. */
const HALVES = "grid grid-cols-2 items-center";

/* The line by a time, in its day's colour (`turnTone`, as `clockTone`). */
const EDGE_TONE = {
  accent: "border-[var(--m-accent)]",
  secondary: "border-[var(--m-secondary)]",
} as const;

/**
 * Icon & list's (`2`) days. Each event split at the middle: its time on one
 * side, in its day's colour, its title and note on the other, a line down
 * their side by the time in the time's colour, the time and the words each
 * 16px from it. The events take turns, on across the days: the 1st's time
 * on the left, the 2nd's on the right, and so on. A day's date centred over
 * its events, in its day's colour, only when there is more than one day. Am
 * or pm under the clock on a phone, beside it from `@3xl`. Each day starts
 * as the Timeline's: its date flush on a phone, 8px down from `@3xl`; 28px
 * between days. Alternate (`13`) and Full card alternate (`8`).
 */
export function AlternateDays({
  values,
  language,
}: Pick<VariantProps, "values" | "language">) {
  const days = groups(values, "days");
  if (days.length === 0) return null;
  // Each day's first event, counted from the start.
  const firstEvent = days.map((_, index) =>
    days.slice(0, index).reduce((total, day) => total + day.items.length, 0),
  );

  return (
    <ol>
      {days.map((day, index) => (
        <li key={index} className="pb-7 @3xl:pt-2 @3xl:pb-5">
          <Day
            day={day}
            date={
              days.length > 1
                ? scheduleDay(day.values.date ?? "", language)
                : ""
            }
            tone={clockTone(index, "secondary")}
            first={firstEvent[index]}
            language={language}
            line={EDGE_TONE[turnTone(index, "secondary")]}
          />
        </li>
      ))}
    </ol>
  );
}

/** One day: its date centred, then its events, each split at the middle. */
function Day({
  day,
  date,
  tone,
  first,
  language,
  line,
}: {
  day: Group;
  date: string;
  tone: string;
  /** The day's first event, counted from the start: who takes which side. */
  first: number;
  language: Language;
  /** The line by the time, in its colour. */
  line: string;
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
                  className={`flex flex-col @3xl:flex-row @3xl:gap-x-[0.3ch] ${flipped ? "order-2 items-start text-left @3xl:justify-start" : "items-end text-right @3xl:justify-end"} ${flipped ? "pl-4" : "pr-4"} ${TIME_TEXT} ${tone}`}
                >
                  <span>{clock}</span>
                  {meridiem ? <span>{meridiem}</span> : null}
                </span>
                <div
                  className={`min-w-0 ${flipped ? "order-1 text-right" : ""} ${line} ${flipped ? "border-r-1 pr-4" : "border-l-1 pl-4"}`}
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
