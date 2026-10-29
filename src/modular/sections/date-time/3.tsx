import { daysAround, monthName, weekday, yearOf } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BAND_LINE,
  CAPS,
  CORNER,
  DISPLAY,
  GROUND,
  MUTED,
  PAD,
  SECTION_GROUND,
  STACK,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";

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

/** Every page's frame, on the other surface. */
const PAGE = `${CORNER} flex-none overflow-hidden border-1 border-[var(--m-line)] text-center`;

/*
 * The days beside it, by their distance: the nearest from `@3xl`, the
 * farther from `@5xl`, each fainter than the one nearer the day. None while
 * a pattern is on: faded, they would let it show through.
 */
const NEIGHBOUR = {
  1: "hidden opacity-60 @3xl:block in-data-pattern:hidden!",
  2: "hidden opacity-35 @5xl:block in-data-pattern:hidden!",
};

/**
 * The event's day as a tear-off calendar page in the middle — its weekday
 * on an accent strip, the day large, the month and year under it — with
 * the two days before and after as smaller pages fading out beside it.
 * Only the eyebrow over it, no other heading part. A phone, or a pattern,
 * shows the day alone.
 */
export function Variant({ values, basics, language, ground }: VariantProps) {
  const days = daysAround(basics.date, language, 2);

  return (
    <div className={`${STACK} items-center ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <div className="flex items-center justify-center gap-4">
        {days.map((day) =>
          day.offset === 0 ? (
            <time
              key={day.offset}
              dateTime={basics.date}
              className={`${PAGE} ${DAY_PAGE} ${GROUND[otherGround(ground)]}`}
            >
              <span
                className={`${STRIP} block bg-[var(--m-accent)] py-3 text-[color:var(--m-accent-ink)]`}
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
              ground={ground}
              className={NEIGHBOUR[Math.abs(day.offset) as 1 | 2]}
            />
          ),
        )}
      </div>
    </div>
  );
}

/** A day beside the event's: its short weekday on a plain strip, its number muted. */
function SmallPage({
  weekday,
  date,
  ground,
  className,
}: {
  weekday: string;
  date: number;
  ground: SectionGround;
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`${PAGE} ${SIDE_PAGE} ${GROUND[otherGround(ground)]} ${className}`}
    >
      <span
        className={`${CAPS} ${MUTED} block border-b-1 border-[var(--m-line)] py-2 font-medium`}
      >
        {weekday}
      </span>
      <span className={`${BAND_LINE} ${MUTED} block py-4`}>{date}</span>
    </div>
  );
}
