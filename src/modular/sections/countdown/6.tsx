"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { pad } from "@/lib/event";
import { NUMBER_SIZE, UNITS, useCountdown } from "@/modular/countdown";
import {
  CAPS,
  MUTED,
  PAD_BOTTOM,
  PAD_X,
  SERIF,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";

/** The numbers' face, size and colour; the big-day line wears it too. */
const NUMBER = `${SERIF} ${NUMBER_SIZE} leading-none text-[color:var(--m-accent)]`;

/**
 * Days, hours, minutes and seconds like a clock: the numbers in the accent
 * with colons between them in the muted ink at 30%, each unit under its
 * number, centred. It shares the date's band, as Joined does, so it has no top padding of
 * its own; after a section in two columns (`afterSplit`) it sits in the
 * second (`JoinedColumn`), at its phone spacing. No eyebrow, not even once the day has come.
 * Until the first tick the numbers are dashes.
 */
export function Variant({ basics, ground, afterSplit }: VariantProps) {
  const t = useTranslations("Sections");
  const { left, done } = useCountdown(basics);

  return (
    <JoinedColumn
      afterSplit={afterSplit}
      className={`${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}
    >
      {done ? (
        <Done done={done} className={NUMBER} eyebrow={false} />
      ) : (
        <div
          role="timer"
          aria-label={
            left ? t("countdownLabel", { count: left.days }) : undefined
          }
          className={`flex w-full items-start justify-center gap-2 py-7 ${afterSplit ? "" : "@3xl:gap-5"}`}
        >
          {UNITS.map((unit, index) => (
            <Fragment key={unit}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className={`${SERIF} ${NUMBER_SIZE} leading-none text-(--m-ink-muted)/30`}
                >
                  :
                </span>
              ) : null}
              <div
                aria-hidden="true"
                className={`flex min-w-12 flex-col items-center gap-2 ${afterSplit ? "" : "@3xl:min-w-16"}`}
              >
                <span className={`${NUMBER} tabular-nums`}>
                  {left ? pad(left[unit]) : "––"}
                </span>
                <span className={`${CAPS} ${MUTED} font-medium`}>
                  {t(unit, { count: left?.[unit] ?? 0 })}
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </JoinedColumn>
  );
}
