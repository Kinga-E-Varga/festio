import {
  dayOfMonth,
  list,
  monthName,
  weekday,
  yearOf,
} from "@/modular/content";
import { Icon } from "@/modular/icons";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  CAPS,
  CORNER,
  DISPLAY,
  GROUND,
  MUTED,
  PAD,
  SPLIT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { otherGround } from "@/modular/ground";

/**
 * The heading beside a calendar card: month, the day large, weekday and
 * year, then up to four parts of the day. The card stops at 460px and
 * keeps to the right, so it never stretches wide. One column on a phone.
 */
export function Variant({ values, basics, language, ground }: VariantProps) {
  const moments = list(values, "moments").slice(0, 4);

  return (
    <div className={`${SPLIT} items-center ${GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <div
        className={`${CORNER} flex min-h-64 w-full flex-col items-center justify-center border-1 border-[var(--m-line)] ${GROUND[otherGround(ground)]} px-6 py-9 text-center @3xl:min-h-70 @3xl:max-w-[460px] @3xl:justify-self-end`}
      >
        <time dateTime={basics.date} className="flex flex-col items-center">
          <span className="text-[14px] leading-[1.5] font-semibold tracking-[0.19em] text-[color:var(--m-secondary)] uppercase">
            {monthName(basics.date, language)}
          </span>
          <span className={`${DISPLAY} mt-2 mb-1 text-[96px]`}>
            {dayOfMonth(basics.date)}
          </span>
          <span className={`${CAPS} ${MUTED} text-[14px]!`}>
            {weekday(basics.date, language)} · {yearOf(basics.date)}
          </span>
        </time>
        {moments.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-2.5">
            {moments.map((moment, index) => (
              <li
                key={index}
                className={`${BODY_SM} flex flex-wrap text-[14px]! items-center justify-center gap-x-2 gap-y-0.5 text-[color:var(--m-ink)]`}
              >
                <Icon
                  name="clock"
                  className="size-4.5 shrink-0 text-[color:var(--m-secondary)]"
                />
                <span className="tabular-nums">{moment.time}</span>
                <span>{moment.title}</span>
                {moment.place ? (
                  <span className={MUTED}>· {moment.place}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
