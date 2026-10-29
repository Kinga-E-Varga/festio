import { dayOfMonth, monthName, text, yearOf } from "@/modular/content";
import { H2, NAMES, PAD, TONE_TEXT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** The month and the year either side of the day: italic at the heading's size, in the accent. */
const SIDE = `${H2} ${TONE_TEXT.accent} italic capitalize`;

/**
 * The date alone, centred, no heading and no box, in one row: the month,
 * the day as the title's names but in the secondary, between two upright
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
        <span className={`${SIDE} @xl:justify-self-end`}>
          {monthName(
            basics.date,
            language,
            text(values, "monthName") === "short",
          )}
        </span>
        <span
          className={`${NAMES} text-[color:var(--m-secondary)]! border-y-1 border-[var(--m-line)] px-4 py-3 @xl:border-x-1 @xl:border-y-0 @xl:py-0 @3xl:px-6`}
        >
          {dayOfMonth(basics.date)}
        </span>
        <span className={`${SIDE} @xl:justify-self-start`}>
          {yearOf(basics.date)}
        </span>
      </time>
    </div>
  );
}
