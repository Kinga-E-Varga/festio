"use client";

import { useTranslations } from "next-intl";
import { CHIP, CHIP_OFF, CHIP_ON } from "@/components/dashboard/guest-list/styles";
import type { GuestCounts, GuestFilter } from "@/types/guests";

interface GuestSummaryProps {
  counts: GuestCounts;
  total: number;
  useList: boolean;
  filter: GuestFilter;
  expected: number;
  onFilter: (filter: GuestFilter) => void;
}

interface Chip {
  filter: GuestFilter;
  label: string;
}

/** The counts, each one also the filter for what it counts. */
export function GuestSummary({ counts, total, useList, filter, expected, onFilter }: GuestSummaryProps) {
  const t = useTranslations("GuestList");
  const chips: Chip[] = [
    { filter: "all", label: t("all", { count: total }) },
    { filter: "going", label: t("going", { count: counts.going }) },
    { filter: "not_going", label: t("notGoing", { count: counts.notGoing }) },
  ];
  if (useList) chips.push({ filter: "waiting", label: t("waiting", { count: counts.waiting }) });
  if (useList && counts.notSent > 0) {
    chips.push({ filter: "notSent", label: t("notSent", { count: counts.notSent }) });
  }
  if (counts.unknown > 0) chips.push({ filter: "unknown", label: t("unknown", { count: counts.unknown }) });
  if (counts.duplicate > 0) {
    chips.push({ filter: "duplicate", label: t("duplicates", { count: counts.duplicate }) });
  }

  return (
    <div role="group" aria-label={t("summaryLabel")} className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.filter}
          type="button"
          aria-pressed={filter === chip.filter}
          onClick={() => onFilter(filter === chip.filter ? "all" : chip.filter)}
          className={`${CHIP} ${filter === chip.filter ? CHIP_ON : CHIP_OFF}`}
        >
          {chip.label}
        </button>
      ))}
      {useList ? null : (
        <span className="ml-1 text-[12.5px] text-neutral-700">
          {t("repliedOfExpected", { replied: counts.replied, expected })}
        </span>
      )}
    </div>
  );
}
