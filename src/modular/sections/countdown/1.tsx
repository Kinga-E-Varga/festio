"use client";

import { useTranslations } from "next-intl";
import { pad } from "@/lib/event";
import { UNITS, useTimeLeft } from "@/modular/countdown";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  CAPS,
  GROUND,
  MUTED,
  PAD_BOTTOM,
  PAD_X,
  SERIF,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Days, hours, minutes and seconds to the first part of the day, live. It
 * shares date & time's band, so it has no top padding of its own; on the
 * accent band its ground turns every colour to the band's ink. Until the first tick the numbers
 * are dashes; past the start they stay at 00.
 */
export function Variant({ values, basics, related, ground }: VariantProps) {
  const t = useTranslations("Sections");
  const left = useTimeLeft(basics, related);

  return (
    <div
      className={`flex flex-col items-center gap-7 ${GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}
    >
      <SectionHeading values={values} />
      <div
        role="timer"
        aria-label={
          left ? t("countdownLabel", { count: left.days }) : undefined
        }
        className="flex w-full justify-around gap-2.5 @3xl:w-auto @3xl:justify-center @3xl:gap-16 @5xl:gap-24"
      >
        {UNITS.map((unit) => (
          <div
            key={unit}
            aria-hidden="true"
            className="flex min-w-12 flex-col items-center gap-1.5"
          >
            <span
              className={`${SERIF} text-[32px] leading-none tabular-nums text-[color:var(--m-accent)] @3xl:text-[40px]`}
            >
              {left ? pad(left[unit]) : "––"}
            </span>
            <span className={`${CAPS} ${MUTED} font-medium`}>
              {t(unit, { count: left?.[unit] ?? 0 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
