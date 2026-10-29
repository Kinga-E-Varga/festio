"use client";

import { useTranslations } from "next-intl";
import { pad } from "@/lib/event";
import { NUMBER_SIZE, UNITS, useCountdown } from "@/modular/countdown";
import {
  BAND_LINE,
  CAPS,
  H3,
  ITALIC_LINE,
  MUTED,
  PAD,
  SERIF,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";

/** The closing line's face, size and colour. */
const NUMBER = `${SERIF} ${NUMBER_SIZE} leading-none text-[color:var(--m-accent)]`;

/** Hours, minutes and seconds: a card's heading, in the secondary. */
const SMALL = `${H3} text-[color:var(--m-secondary)]! leading-none tabular-nums`;

/**
 * The days first, set as the bold reply's heading (`BAND_LINE`) but
 * in the accent, "days to go" in italic, muted, under them, then hours,
 * minutes and seconds small in a row under a hairline. No eyebrow, not even once
 * the day has come. Until the first tick the numbers are dashes.
 */
export function Variant({ basics, ground }: VariantProps) {
  const t = useTranslations("Sections");
  const { left, done } = useCountdown(basics);

  return (
    <div
      className={`flex flex-col items-center gap-7 ${SECTION_GROUND[ground]} ${PAD}`}
    >
      {done ? (
        <Done done={done} className={NUMBER} eyebrow={false} />
      ) : (
        <div
          role="timer"
          aria-label={
            left ? t("countdownLabel", { count: left.days }) : undefined
          }
          className="flex flex-col items-center text-center"
        >
          <span
            aria-hidden="true"
            className={`${BAND_LINE} text-[color:var(--m-accent)] tabular-nums`}
          >
            {left ? left.days : "––"}
          </span>
          <span aria-hidden="true" className={`${ITALIC_LINE} ${MUTED} mt-3`}>
            {t("countdownDaysToGo", { count: left?.days ?? 0 })}
          </span>
          <div
            aria-hidden="true"
            className="mt-7 flex gap-7 border-t-1 border-[var(--m-line)] pt-5 @3xl:gap-10"
          >
            {UNITS.slice(1).map((unit) => (
              <div
                key={unit}
                className="flex min-w-12 flex-col items-center gap-1.5"
              >
                <span className={SMALL}>{left ? pad(left[unit]) : "––"}</span>
                <span className={`${CAPS} ${MUTED} font-medium`}>
                  {t(unit, { count: left?.[unit] ?? 0 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
