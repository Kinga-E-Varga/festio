"use client";

import { useTranslations } from "next-intl";
import { pad } from "@/lib/event";
import { UNITS, useTimeLeft } from "@/modular/countdown";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  CORNER,
  GROUND,
  MUTED,
  PAD_SNUG,
  SERIF_BOLDER,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Days, hours, minutes and seconds to the first part of the day, live, each
 * in a card on the other surface, the number in the ink —
 * two by two on a narrow column, in a row from `@xl`. A section of its own: it takes its
 * turn of the grounds and its full padding. Until the first tick the numbers
 * are dashes; past the start they stay at 00.
 */
export function Variant({ values, basics, related, ground }: VariantProps) {
  const t = useTranslations("Sections");
  const left = useTimeLeft(basics, related);

  return (
    <div
      className={`flex flex-col items-center gap-7 ${GROUND[ground]} ${PAD_SNUG}`}
    >
      <SectionHeading values={values} />
      <div
        role="timer"
        aria-label={
          left ? t("countdownLabel", { count: left.days }) : undefined
        }
        className="grid w-full max-w-sm grid-cols-2 gap-2.5 @xl:max-w-xl @xl:grid-cols-4 @3xl:w-auto @3xl:max-w-none @3xl:gap-4"
      >
        {UNITS.map((unit) => (
          <div
            key={unit}
            aria-hidden="true"
            className={`flex flex-col items-center gap-2 ${CORNER} border-1 border-[var(--m-line)] ${GROUND[otherGround(ground)]} px-2 py-4 @3xl:min-w-39 @3xl:px-6 @3xl:py-6`}
          >
            <span
              className={`${SERIF_BOLDER} text-[40px] leading-none tabular-nums text-[color:var(--m-ink)] @3xl:text-[48px]`}
            >
              {left ? pad(left[unit]) : "––"}
            </span>
            <span
              className={`${MUTED} text-[12px] leading-[1.5] font-medium tracking-[0.14em] uppercase`}
            >
              {t(unit, { count: left?.[unit] ?? 0 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
