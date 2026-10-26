"use client";

import { useCallback, useRef, useState } from "react";
import { useDismiss } from "@/components/dashboard/event-nav/useDismiss";
import { INPUT, MENU_BOX, MENU_ROW } from "@/components/dashboard/styles";
import { FoldChevron } from "@/components/icons";

interface FilterMenuProps<T extends string> {
  /** Its name for screen readers: the box's title names it on screen. */
  label: string;
  options: { value: T; name: string; count: number }[];
  value: T;
  onPick: (value: T) => void;
}

/**
 * A field that opens a menu built like the language menu: a row per
 * option, its name, its count at the right in grey, the current one in
 * bold. A pick, a press outside or Escape closes it.
 */
export function FilterMenu<T extends string>({
  label,
  options,
  value,
  onPick,
}: FilterMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, rootRef, close);
  const current = options.find((option) => option.value === value);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={label}
        onClick={() => setOpen(!open)}
        className={`${INPUT} flex cursor-pointer items-center justify-between gap-3 text-left`}
      >
        <span>
          {current?.name}{" "}
          <span className="hint-text tabular-nums">{current?.count}</span>
        </span>
        <FoldChevron open={open} className="size-4 text-neutral-700" />
      </button>

      {open ? (
        <ul className={`${MENU_BOX} top-full left-0 mt-1 min-w-full`}>
          {options.map((option) => {
            const isCurrent = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  aria-current={isCurrent || undefined}
                  onClick={() => {
                    onPick(option.value);
                    close();
                  }}
                  className={`${MENU_ROW} justify-between whitespace-nowrap ${
                    isCurrent ? "font-semibold text-neutral-950" : ""
                  }`}
                >
                  {option.name}
                  <span className="hint-text tabular-nums">{option.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
