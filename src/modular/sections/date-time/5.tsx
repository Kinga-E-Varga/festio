import { dayOfMonth, monthName, text, yearOf } from "@/modular/content";
import {
  H2_FACE,
  NAMES_FACE,
  PAD,
  TONE_TEXT,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** The month's and year's letter spacing: a touch tighter than plain, more open than the -0.03em their face sets. */
const SIDE_TRACKING = "tracking-[-0.01em]!";

/** The year, right of the day: the heading's face (`H2_FACE`) a little over its size, in the accent. */
const YEAR = `${H2_FACE} ${TONE_TEXT.accent} ${SIDE_TRACKING} text-[38px] @3xl:text-[48px] @5xl:text-[53px]`;

/**
 * The month, left of the day: the year's face in capitals, at 85% of its
 * size at every width (`YEAR`'s 38 / 48 / 53px), as capitals stand taller
 * than the year's figures.
 */
const MONTH = `${H2_FACE} ${TONE_TEXT.accent} ${SIDE_TRACKING} uppercase text-[32px] @3xl:text-[41px] @5xl:text-[45px]`;

/** The day: the names' face (`NAMES_FACE`), a little over the names' size. */
const DAY = `${NAMES_FACE} text-[53px] @md:text-[62px] @3xl:text-[75px] @5xl:text-[88px]`;

/**
 * The date alone, centred, no heading and no box, in one row: the month
 * in capitals (`MONTH`),
 * the day in the names' face a little larger (`DAY`), in the secondary, between two upright
 * lines, the year. The month full or short, as the host picked
 * (`monthName`). On a narrow column the three stack, the lines then above
 * and below the day. The day sits in the middle of the page whatever the
 * month's length.
 */
export function Variant({ values, basics, language, ground }: VariantProps) {
  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      {/*
       * Two equal sides: the day stays in the middle, however long the
       * month. On a narrow column, one above the other, all centred.
       */}
      <time
        dateTime={basics.date}
        className="grid justify-items-center gap-3 @xl:grid-cols-[1fr_auto_1fr] @xl:items-center @xl:gap-6 @3xl:gap-9"
      >
        <span className={`${MONTH} @xl:justify-self-end`}>
          {monthName(
            basics.date,
            language,
            text(values, "monthName") === "short",
          )}
        </span>
        <span
          className={`${DAY} text-[color:var(--m-secondary)]! border-y-2 border-[var(--m-line)] px-4 py-3 @xl:border-x-2 @xl:border-y-0 @xl:py-0 @3xl:px-6`}
        >
          {dayOfMonth(basics.date)}
        </span>
        <span className={`${YEAR} @xl:justify-self-start`}>
          {yearOf(basics.date)}
        </span>
      </time>
    </div>
  );
}
