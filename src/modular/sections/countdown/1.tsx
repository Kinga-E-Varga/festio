"use client";

import { useTranslations } from "next-intl";
import { pad } from "@/lib/event";
import { NUMBER_SIZE, UNITS, useCountdown } from "@/modular/countdown";
import { SectionHeading } from "@/modular/SectionHeading";
import { CAPS, MUTED, PAD, SERIF, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";

/** The numbers' face, size and colour; the big-day line wears it too. */
const NUMBER = `${SERIF} ${NUMBER_SIZE} leading-none text-[color:var(--m-ink)]`;

/**
 * Days, hours, minutes and seconds to the start of the day, live, the
 * numbers in the ink. A section of its own: it takes its turn of the
 * grounds and its full padding. Until the first tick the numbers are
 * dashes; on the day, and after it, a fixed eyebrow and one line say so in
 * their place.
 */
export function Variant({ values, basics, ground }: VariantProps) {
  const t = useTranslations("Sections");
  const { left, done } = useCountdown(basics);

  return (
    <div
      className={`flex flex-col items-center gap-7 ${SECTION_GROUND[ground]} ${PAD}`}
    >
      {done ? (
        <Done done={done} className={NUMBER} />
      ) : (
        <>
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
                <span className={`${NUMBER} tabular-nums`}>
                  {left ? pad(left[unit]) : "––"}
                </span>
                <span className={`${CAPS} ${MUTED} font-medium`}>
                  {t(unit, { count: left?.[unit] ?? 0 })}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
