"use client";

import { useTranslations } from "next-intl";
import { pad } from "@/lib/event";
import { UNITS, type useCountdown } from "@/modular/countdown";

/**
 * The live numbers in a row, each over its unit: spread across a phone,
 * centred from `@3xl`; spread across the column after a section in two
 * (`afterSplit`). Dashes until the first tick. Simple, Simple joined and
 * Sticker joined (`1`, `3`, `11`); their looks in `number` and `unit`.
 */
export function NumberRow({
  left,
  number,
  unit: unitLook,
  afterSplit = false,
}: {
  left: ReturnType<typeof useCountdown>["left"];
  number: string;
  unit: string;
  afterSplit?: boolean;
}) {
  const t = useTranslations("Sections");

  return (
    <div
      role="timer"
      aria-label={left ? t("countdownLabel", { count: left.days }) : undefined}
      className={`flex w-full justify-around gap-2.5 ${afterSplit ? "" : "@3xl:w-auto @3xl:justify-center @3xl:gap-16 @5xl:gap-24"}`}
    >
      {UNITS.map((unit) => (
        <div
          key={unit}
          aria-hidden="true"
          className="flex min-w-12 flex-col items-center gap-1.5"
        >
          <span className={`${number} tabular-nums`}>
            {left ? pad(left[unit]) : "––"}
          </span>
          <span className={unitLook}>
            {t(unit, { count: left?.[unit] ?? 0 })}
          </span>
        </div>
      ))}
    </div>
  );
}
