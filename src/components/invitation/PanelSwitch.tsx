"use client";

import type { ReactNode } from "react";
import { LABEL } from "@/components/dashboard/event-editor/styles";

interface PanelSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Drawn in place of the label text; the switch is still named by `label`. */
  heading?: ReactNode;
  /** A small control just left of the track. */
  before?: ReactNode;
  /** Extra classes for the row. */
  className?: string;
}

/**
 * An on/off switch in the side panel's chrome: the label on the left, the
 * track on the right, in the gold pair — solid gold when on, a pale track
 * with a gold edge when off. An invisible layer stretches the track's tap
 * area to 44px tall, enough for a finger, without making it look bigger.
 */
export function PanelSwitch({
  id,
  label,
  checked,
  onChange,
  heading,
  before,
  className = "",
}: PanelSwitchProps) {
  return (
    <div
      className={`flex min-h-10 items-center justify-between gap-3 ${className}`}
    >
      {/* Not a `<label>`: only the switch itself flips, never its name. */}
      {heading ?? <span className={LABEL}>{label}</span>}
      <div className="flex shrink-0 items-center gap-3">
        {before}
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={() => onChange(!checked)}
          className="relative h-5 w-9 shrink-0 cursor-pointer rounded-full before:absolute before:-inset-x-1.5 before:-inset-y-3 before:content-[''] border border-mustard-300 bg-mustard-100 transition-colors hover:border-mustard-400 aria-checked:border-mustard-500 aria-checked:bg-mustard-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard-500"
        >
          <span
            aria-hidden="true"
            className={`absolute top-1/2 left-0.5 size-3.5 -translate-y-1/2 rounded-full transition-transform ${checked ? "translate-x-4 bg-neutral-50" : "bg-mustard-400"}`}
          />
        </button>
      </div>
    </div>
  );
}
