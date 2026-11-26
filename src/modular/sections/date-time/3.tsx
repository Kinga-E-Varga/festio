import { daysAround, monthName, weekday, yearOf } from "@/modular/content";
import {
  BAND_LINE,
  CAPS,
  CORNER,
  CUT_DIVIDER,
  DISPLAY,
  GROUND_FILL,
  HAIRLINE_FRAME,
  SHAPE_CUT,
  MUTED,
  PAD,
  SECTION_GROUND,
  STACK,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** The weekday on the day's accent strip. */
const STRIP =
  "text-[14px] leading-[1.5] font-semibold tracking-[0.19em] uppercase";

/*
 * The pages' widths and the day's number. They grow only once five fit at the
 * larger size: 340px + 4 × 170px + gaps needs about 1300px of column. The side
 * pages' numbers are a big line (`BAND_LINE`).
 */
const DAY_PAGE = "w-75 max-w-full @min-[1300px]:w-85";
const DAY_NUMBER = "text-[94px] @min-[1300px]:text-[128px]";
const SIDE_PAGE = "w-27.5 @min-[1300px]:w-42.5";

/**
 * Every page's frame: a card's edge (`HAIRLINE_FRAME`), a hairline with the
 * pattern off and none with it on; filled with the second surface
 * (`GROUND_FILL`), with or without a pattern. The section
 * draws no ground of its own (`bare`), so the page's surface is behind it.
 */
const PAGE = `${HAIRLINE_FRAME} flex-none overflow-hidden text-center`;

/*
 * The days beside it, by their distance: the nearest from `@3xl`, the
 * farther from `@5xl` (`at`), each fainter than the one nearer the day
 * (`fade`).
 */
const NEIGHBOUR = {
  1: { at: "hidden @3xl:block", fade: "opacity-60" },
  2: { at: "hidden @5xl:block", fade: "opacity-35" },
};

/**
 * The event's day as a tear-off calendar page in the middle — its weekday
 * on an accent strip, a divider under it (`CUT_DIVIDER`), the day large, the month and year under it — with
 * the two days before and after as smaller pages fading out beside it.
 * No heading at all. A phone shows the day alone.
 */
export function Variant({ basics, language, ground }: VariantProps) {
  const days = daysAround(basics.date, language, 2);

  return (
    <div className={`${STACK} items-center ${SECTION_GROUND[ground]} ${PAD}`}>
      <div className="flex items-center justify-center gap-4">
        {days.map((day) =>
          day.offset === 0 ? (
            <time
              key={day.offset}
              dateTime={basics.date}
              className={`${PAGE} ${DAY_PAGE} ${GROUND_FILL["surface-alt"]} ${SHAPE_CUT}`}
            >
              <span
                className={`${STRIP} block ${CUT_DIVIDER} bg-[var(--m-accent)] py-3 text-[color:var(--m-accent-ink)]`}
              >
                {weekday(basics.date, language)}
              </span>
              <span className="flex flex-col items-center gap-2.5 px-6 pt-8 pb-7">
                <span className={`${DISPLAY} ${DAY_NUMBER}`}>{day.date}</span>
                <span className={`${CAPS} ${MUTED} text-[14px]!`}>
                  {monthName(basics.date, language)} · {yearOf(basics.date)}
                </span>
              </span>
            </time>
          ) : (
            <SmallPage
              key={day.offset}
              weekday={day.weekday}
              date={day.date}
              {...NEIGHBOUR[Math.abs(day.offset) as 1 | 2]}
            />
          ),
        )}
      </div>
    </div>
  );
}

/**
 * A day beside the event's: its short weekday on a plain strip, a line
 * under it (`CUT_DIVIDER`: the ring's surface with a pattern on),
 * its number
 * muted. The page is faded (`fade`), which fades its fill too, so the
 * surface is painted behind it: the section draws no ground of its own
 * (`bare`), and the page's pattern must not show through the day.
 */
function SmallPage({
  weekday,
  date,
  at,
  fade,
}: {
  weekday: string;
  date: number;
  at: string;
  fade: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`${CORNER} ${SIDE_PAGE} flex-none ${GROUND_FILL.surface} ${SHAPE_CUT} ${at}`}
    >
      <div className={`${PAGE} w-full ${GROUND_FILL["surface-alt"]} ${fade}`}>
        <span
          className={`${CAPS} ${MUTED} block ${CUT_DIVIDER} py-2 font-medium`}
        >
          {weekday}
        </span>
        <span className={`${BAND_LINE} ${MUTED} block py-4`}>{date}</span>
      </div>
    </div>
  );
}
