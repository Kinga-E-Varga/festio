"use client";

import type { ReactNode } from "react";

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
  tone?: SwitchTone;
}

/** The two switch sizes: the track, the knob, and how far the knob travels. */
const SIZES = {
  md: { track: "h-5 w-9", knob: "size-3.5", on: "translate-x-4" },
  sm: { track: "h-4 w-7", knob: "size-2.5", on: "translate-x-3" },
};

/**
 * The switch's track and its knob, off and on. `solid`, on the panel's own
 * ground, and `light`, a shade lighter when on, on pale surfaces such as the
 * Design tab's section cards: a pale track with a neutral edge when off.
 * `choice` matches the event settings' radio choices: off, a pale track with
 * their ring as its edge and their dot as its knob; on, filled in the ring's
 * colour with a pale knob.
 */
const TONES = {
  solid: {
    track:
      "border-neutral-400 bg-neutral-50 hover:border-neutral-500 aria-checked:border-neutral-500 aria-checked:bg-neutral-500",
    knob: "bg-neutral-400 group-hover/switch:bg-neutral-500",
    knobOn: "bg-neutral-50",
  },
  light: {
    track:
      "border-neutral-400 bg-neutral-50 hover:border-neutral-500 aria-checked:border-neutral-400 aria-checked:bg-neutral-400",
    knob: "bg-neutral-400 group-hover/switch:bg-neutral-500",
    knobOn: "bg-neutral-50",
  },
  choice: {
    track:
      "border-neutral-500 bg-neutral-50 aria-checked:border-neutral-500 aria-checked:bg-neutral-500",
    knob: "bg-neutral-500",
    knobOn: "bg-neutral-50",
  },
};
export type SwitchTone = keyof typeof TONES;

/**
 * The switch alone, in neutral — solid neutral when on, a pale track
 * with a neutral edge when off. An invisible layer stretches the track's tap
 * area to 44px tall, enough for a finger, without making it look bigger.
 * `sm` sits on the Content tab's head bars.
 */
export function Switch({
  id,
  label,
  checked,
  onChange,
  size = "md",
  tone = "solid",
}: {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: keyof typeof SIZES;
  tone?: SwitchTone;
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
      className={`group/switch relative ${track} shrink-0 cursor-pointer rounded-full before:absolute before:-inset-x-1.5 before:-inset-y-3 before:content-[''] border transition-colors ${TONES[tone].track} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1/2 left-0.5 ${knob} -translate-y-1/2 rounded-full transition-[translate,background-color] ${checked ? `${on} ${TONES[tone].knobOn}` : TONES[tone].knob}`}
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
  tone,
}: PanelSwitchProps) {
  return (
    <div
      className={`flex min-h-10 items-center justify-between gap-3 ${className}`}
    >
      <div className={`flex min-w-0 items-center ${gap}`}>
        <Switch
          id={id}
          label={label}
          checked={checked}
          onChange={onChange}
          tone={tone}
        />
        {/* Not a `<label>`: only the switch itself flips, never its name. */}
        {heading ?? <span className="label-caps">{label}</span>}
      </div>
      <div className="flex shrink-0 items-center gap-3">{end}</div>
    </div>
  );
}
