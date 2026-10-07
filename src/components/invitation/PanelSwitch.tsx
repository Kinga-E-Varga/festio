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
  /** Small controls at the row's right end. */
  end?: ReactNode;
  /** Extra classes for the row. */
  className?: string;
  /** The space between the switch and its label. */
  gap?: string;
}

/** The two switch sizes: the track, the knob, and how far the knob travels. */
const SIZES = {
  md: { track: "h-5 w-9", knob: "size-3.5", on: "translate-x-4" },
  sm: { track: "h-4 w-7", knob: "size-2.5", on: "translate-x-3" },
};

/**
 * The switch alone, in the gold pair — solid gold when on, a pale track
 * with a gold edge when off. An invisible layer stretches the track's tap
 * area to 44px tall, enough for a finger, without making it look bigger.
 * `sm` sits on the Content tab's head bars.
 */
export function Switch({
  id,
  label,
  checked,
  onChange,
  size = "md",
}: {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: keyof typeof SIZES;
}) {
  const { track, knob, on } = SIZES[size];
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative ${track} shrink-0 cursor-pointer rounded-full before:absolute before:-inset-x-1.5 before:-inset-y-3 before:content-[''] border border-mustard-300 bg-mustard-100 transition-colors hover:border-mustard-400 aria-checked:border-mustard-500 aria-checked:bg-mustard-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard-500`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1/2 left-0.5 ${knob} -translate-y-1/2 rounded-full transition-transform ${checked ? `${on} bg-neutral-50` : "bg-mustard-400"}`}
      />
    </button>
  );
}

/** An on/off switch in the side panel's chrome: the switch, then its label. */
export function PanelSwitch({
  id,
  label,
  checked,
  onChange,
  heading,
  end,
  className = "",
  gap = "gap-3",
}: PanelSwitchProps) {
  return (
    <div
      className={`flex min-h-10 items-center justify-between gap-3 ${className}`}
    >
      <div className={`flex min-w-0 items-center ${gap}`}>
        <Switch id={id} label={label} checked={checked} onChange={onChange} />
        {/* Not a `<label>`: only the switch itself flips, never its name. */}
        {heading ?? <span className={LABEL}>{label}</span>}
      </div>
      <div className="flex shrink-0 items-center gap-3">{end}</div>
    </div>
  );
}
