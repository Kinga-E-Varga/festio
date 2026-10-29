"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { LINK_TEXT, SOFT_PICK } from "@/components/dashboard/styles";
import { ICON_NAMES, Icon, type IconName } from "@/modular/icons";

/** A choice's size and the gap between them, in px: `size-10`, `gap-1.5`. */
const CELL = 40;
const GAP = 6;

/** The rows shown until More opens the rest. */
const ROWS = 2;

/**
 * One icon's button, a circle: the inputs' fill, Add's fill when picked,
 * Add's hover fill on hover — picked or not.
 */
const CHOICE = `grid size-10 cursor-pointer place-items-center rounded-full border transition-colors ${SOFT_PICK} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500`;

/** More / Less: a link closing the last row, in the room of two circles. */
const MORE = `${LINK_TEXT} h-10 cursor-pointer px-2`;

/**
 * The icon library as a grid of buttons, "No icon" first; the picked one
 * pressed, each named in a tip on hover. Two rows at first, More at the end of the second opening the
 * rest; a picked icon past them takes the last place shown.
 */
export function IconPicker({
  labelId,
  value,
  onPick,
}: {
  /** The field label's id, which names the group. */
  labelId: string;
  value: string;
  onPick: (name: string) => void;
}) {
  const t = useTranslations("ContentTab");
  const [ref, columns] = useColumns();
  const [open, setOpen] = useState(false);
  const icons = shownIcons(columns, open, value);
  const more = open || icons.length < ICON_NAMES.length;

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={labelId}
      className="flex flex-wrap gap-1.5"
    >
      <button
        type="button"
        aria-pressed={value === ""}
        aria-label={t("noIcon")}
        onClick={() => onPick("")}
        className={`${CHOICE} text-[16px]`}
      >
        –
      </button>
      {icons.map((name) => (
        /* Its name in a tip under it, on hover or keyboard focus. */
        <span
          key={name}
          data-tip={t(`iconNames.${name}`)}
          className="option-tip flex"
        >
          <button
            type="button"
            aria-pressed={value === name}
            aria-label={t(`iconNames.${name}`)}
            onClick={() => onPick(name)}
            className={CHOICE}
          >
            <Icon name={name} className="size-5" />
          </button>
        </span>
      ))}
      {more ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className={MORE}
        >
          {open ? t("fewerIcons") : t("moreIcons")}
        </button>
      ) : null}
    </div>
  );
}

/** How many choices fit in a row of the picker, measured as it resizes. */
function useColumns() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(8);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) =>
      setCount(
        Math.max(3, Math.floor((entry.contentRect.width + GAP) / (CELL + GAP))),
      ),
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return [ref, count] as const;
}

/**
 * The icons drawn: every one when open or when all fit; otherwise the
 * rows' worth less "No icon" and More's two places, the picked icon in the
 * last one if it would be left out.
 */
function shownIcons(columns: number, open: boolean, value: string): IconName[] {
  if (open || ICON_NAMES.length + 1 <= columns * ROWS) return ICON_NAMES;
  const shown = ICON_NAMES.slice(0, columns * ROWS - 3);
  const picked = ICON_NAMES.find((name) => name === value);
  return picked && !shown.includes(picked)
    ? [...shown.slice(0, -1), picked]
    : shown;
}
