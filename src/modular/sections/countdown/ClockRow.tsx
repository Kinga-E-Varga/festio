"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { pad } from "@/lib/event";
import { UNITS, type useCountdown } from "@/modular/countdown";

/**
 * The numbers like a clock, colons between them, each unit under its
 * number, centred; after a section in two columns (`afterSplit`) at its
 * phone spacing. Dashes until the first tick. Clock (`6`) and Clock sticker
 * (`14`); their looks in `number`, `colon` and `unit`.
 */
export function ClockRow({
  left,
  number,
  colon,
  unit: unitLook,
  afterSplit = false,
}: {
  left: ReturnType<typeof useCountdown>["left"];
  number: string;
  colon: string;
  unit: string;
  afterSplit?: boolean;
}) {
  const t = useTranslations("Sections");

  return (
    <div
      role="timer"
      aria-label={left ? t("countdownLabel", { count: left.days }) : undefined}
      className={`flex w-full items-start justify-center gap-2 py-7 ${afterSplit ? "" : "@3xl:gap-5"}`}
    >
      {UNITS.map((unit, index) => (
        <Fragment key={unit}>
          {index > 0 ? (
            <span aria-hidden="true" className={colon}>
              :
            </span>
          ) : null}
          <div
            aria-hidden="true"
            className={`flex min-w-12 flex-col items-center gap-2 ${afterSplit ? "" : "@3xl:min-w-16"}`}
          >
            <span className={`${number} tabular-nums`}>
              {left ? pad(left[unit]) : "––"}
            </span>
            <span className={unitLook}>
              {t(unit, { count: left?.[unit] ?? 0 })}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
