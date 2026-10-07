import { dayOfMonth, monthName, weekday, yearOf } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  CAPS,
  CORNER,
  DISPLAY,
  EYEBROW,
  GROUND,
  MUTED,
  PAD,
  SPLIT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** The month's type on Tear-off's strip; Calendar card's month and weekday line wear the eyebrow's. */
const MONTH =
  "text-[14px] leading-[1.5] font-semibold tracking-[0.19em] uppercase";

/**
 * The card's box: it stops short of its column and keeps to the right, so it
 * never stretches wide.
 */
const CARD = `${CORNER} flex w-full flex-col border-1 border-[var(--m-line)] text-center @3xl:justify-self-end @3xl:max-w-[400px]`;

/**
 * How each variant draws its card: its height, where the month goes (a strip
 * across the top, or over the day) and the weekday-and-year line's type.
 */
const LOOKS = {
  calendar: {
    card: "min-h-70",
    strip: null,
    month: `${EYEBROW} mb-2 text-[color:var(--m-secondary)]`,
    // The weekday and year under the day, in the month's style.
    weekday: `${EYEBROW} ${MUTED} mt-1`,
  },
  tearOff: {
    card: "min-h-60 overflow-hidden",
    strip: `${MONTH} bg-[var(--m-accent)] py-3 text-[color:var(--m-accent-ink)]`,
    month: null,
    weekday: `${CAPS} ${MUTED} text-[14px]!`,
  },
};

/**
 * The heading beside a calendar card: month, the day large, weekday and year.
 * Shared by the Calendar card and Tear-off variants. Calendar card sets the
 * month in the secondary over the day and the weekday and year muted under
 * it, the day in the accent; Tear-off puts the month on an accent strip
 * across the top, like a tear-off page, and the weekday and year under the
 * day in the muted ink. One column on a phone.
 */
export function Calendar({
  values,
  basics,
  language,
  ground,
  look,
}: VariantProps & { look: keyof typeof LOOKS }) {
  const month = monthName(basics.date, language);
  const { card, strip, month: monthClass, weekday: weekdayClass } = LOOKS[look];

  return (
    <div className={`${SPLIT} items-center ${GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <time
        dateTime={basics.date}
        className={`${CARD} ${card} ${GROUND[otherGround(ground)]}`}
      >
        {strip ? <span className={strip}>{month}</span> : null}
        <span className="flex flex-1 flex-col items-center justify-center px-6 py-9">
          {monthClass ? <span className={monthClass}>{month}</span> : null}
          <span className={`${DISPLAY} mb-1 text-[96px]`}>
            {dayOfMonth(basics.date)}
          </span>
          <span className={weekdayClass}>
            {weekday(basics.date, language)} · {yearOf(basics.date)}
          </span>
        </span>
      </time>
    </div>
  );
}
