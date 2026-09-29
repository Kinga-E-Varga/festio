"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  CHIP,
  CHIP_OFF,
  CHIP_ON,
} from "@/components/dashboard/guest-list/styles";
import { Icon } from "@/components/icons";
import type { GuestCounts, GuestFilter } from "@/types/guests";

interface GuestSummaryProps {
  counts: GuestCounts;
  total: number;
  useList: boolean;
  filter: GuestFilter;
  onFilter: (filter: GuestFilter) => void;
}

interface Chip {
  filter: GuestFilter;
  label: string;
}

/** All, Coming and Not coming up front; every other count behind one Filter button. */
export function GuestSummary({
  counts,
  total,
  useList,
  filter,
  onFilter,
}: GuestSummaryProps) {
  const t = useTranslations("GuestList");
  const chips: Chip[] = [
    { filter: "all", label: t("all", { count: total }) },
    { filter: "going", label: t("going", { count: counts.going }) },
    { filter: "not_going", label: t("notGoing", { count: counts.notGoing }) },
  ];
  const more: Chip[] = [];
  if (useList)
    more.push({
      filter: "waiting",
      label: t("waiting", { count: counts.waiting }),
    });
  if (useList && counts.notSent > 0) {
    more.push({
      filter: "notSent",
      label: t("notSent", { count: counts.notSent }),
    });
  }
  if (counts.attention > 0) {
    more.push({
      filter: "attention",
      label: t("attention", { count: counts.attention }),
    });
  }
  const pick = (chip: Chip) =>
    onFilter(filter === chip.filter ? "all" : chip.filter);

  return (
    <div
      role="group"
      aria-label={t("summaryLabel")}
      className="flex min-w-0 flex-wrap items-center gap-2"
    >
      {chips.map((chip) => (
        <button
          key={chip.filter}
          type="button"
          aria-pressed={filter === chip.filter}
          onClick={() => pick(chip)}
          className={`${CHIP} ${filter === chip.filter ? CHIP_ON : CHIP_OFF}`}
        >
          {chip.label}
        </button>
      ))}
      {more.length > 0 ? (
        <FilterMenu
          options={more}
          active={more.find((chip) => chip.filter === filter)}
          onPick={pick}
        />
      ) : null}
    </div>
  );
}

interface FilterMenuProps {
  options: Chip[];
  active: Chip | undefined;
  onPick: (chip: Chip) => void;
}

/** One button for the less common filters; it names the one in use. */
function FilterMenu({ options, active, onPick }: FilterMenuProps) {
  const t = useTranslations("GuestList");
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        event.preventDefault();
        setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`${CHIP} gap-1.5 ${active ? CHIP_ON : CHIP_OFF}`}
      >
        {active ? t("filterActive", { filter: active.label }) : t("filter")}
        <Icon
          name="chevron"
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-full left-0 z-10 mt-1 min-w-[200px] border border-mustard-300 bg-neutral-50 py-1 shadow-md"
        >
          {options.map((chip) => (
            <button
              key={chip.filter}
              type="button"
              role="menuitemradio"
              aria-checked={active?.filter === chip.filter}
              onClick={() => {
                onPick(chip);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-left text-[13px] text-neutral-800 transition-colors hover:bg-mustard-100 aria-checked:font-semibold aria-checked:text-forest-600"
            >
              {chip.label}
              {active?.filter === chip.filter ? (
                <Icon name="check" className="size-3.5" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
