"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { Icon } from "@/components/icons";
import type { IconName } from "@/types/dashboard";
import { BOX_MARK, BOX_MARK_STROKE, DESIGN_BOX_BUTTON } from "./styles";

/**
 * One choice card in the rolled-out grid, as wide as its column. Picked, a
 * gold ring with a gap; hovered, a fainter one. Callers add its height,
 * what it shows and its own fill.
 */
export const OPTION_CARD =
  "m-1 flex cursor-pointer rounded-sm ring-offset-2 ring-offset-mustard-100 transition-shadow hover:ring-1 hover:ring-mustard-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mustard-500 aria-pressed:ring-2 aria-pressed:ring-mustard-500";

interface RollOutProps {
  /** The rolled-out grid's id. */
  id: string;
  /** What the box says to screen readers: the setting and its value. */
  label: string;
  icon?: IconName;
  /**
   * The icon's line, when `BOX_MARK_STROKE` makes it look heavier than the
   * rest: a big outline shape carries more ink than a small one.
   */
  iconStroke?: number;
  /** What the box shows of the current choice. */
  summary: ReactNode;
  /** The choices, as `OPTION_CARD` buttons. */
  children: ReactNode;
  /** How the cards are laid out; left out, three or four columns. */
  layout?: string;
}

/**
 * The event editor's summary box, the whole of it a button: the current
 * choice, a down arrow, and "Change" beside it while hovered or focused —
 * "Close" while open. Clicked, the choices roll out under it as cards on the
 * panel itself; they stay out after a pick, so the host can try several,
 * and the box rolls them back.
 */
export function RollOut({
  id,
  label,
  icon,
  iconStroke = BOX_MARK_STROKE,
  summary,
  children,
  layout = "grid grid-cols-3 gap-3 @min-[360px]:grid-cols-4",
}: RollOutProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => setOpen(!open)}
        className={DESIGN_BOX_BUTTON}
      >
        {icon ? (
          <Icon
            name={icon}
            className={`${BOX_MARK} w-[22px]`}
            strokeWidth={iconStroke}
          />
        ) : null}
        <span className="flex min-w-0 flex-1">{summary}</span>
        <RollArrow open={open} reveal="group-focus-visible:opacity-100" />
      </button>
      <RollPanel id={id} open={open}>
        <div className="overflow-hidden">
          <div className="@container pt-3 pb-1">
            <div className={layout}>{children}</div>
          </div>
        </div>
      </RollPanel>
    </>
  );
}

/**
 * A Design box's down arrow, with "Change" beside it while hovered or
 * focused — "Close" while open. `reveal` is the class that shows the word
 * on focus, as the box's markup decides what counts as focused.
 */
export function RollArrow({
  open,
  reveal,
  action,
}: {
  open: boolean;
  reveal: string;
  /** What it says while shut; left out, "Change". */
  action?: string;
}) {
  const t = useTranslations("DesignTab");
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center gap-1.5 text-mustard-600"
    >
      <span
        className={`text-[13.5px] opacity-0 transition-opacity group-hover:opacity-100 ${reveal}`}
      >
        {open ? t("close") : (action ?? t("change"))}
      </span>
      <Icon
        name="chevron"
        className={`size-5 transition-transform ${open ? "rotate-180" : ""}`}
      />
    </span>
  );
}

/**
 * Rolls out by growing its one grid row from nothing to its height; while
 * shut it is out of the tab order. Its child must clip (`overflow-hidden`).
 */
export function RollPanel({
  id,
  open,
  children,
}: {
  id: string;
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      inert={!open}
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      {children}
    </div>
  );
}
