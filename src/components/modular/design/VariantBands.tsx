"use client";

import { Fragment, useState } from "react";
import { Icon } from "@/components/icons";
import { RollPanel } from "./RollOut";
import {
  BOX_MARK,
  BOX_MARK_STROKE,
  DESIGN_BAND_BUTTON,
  MARK_SLOT,
} from "./styles";

interface Option<T extends string> {
  value: T;
  label: string;
  group?: string;
}

interface VariantBandsProps<T extends string> {
  /** The rolled-out bands' id, for the arrow that opens them. */
  id: string;
  open: boolean;
  /** In order; options in one group follow each other. */
  options: Option<T>[];
  value: T;
  onPick: (value: T) => void;
  /** A line under the bands, rolled out with them. */
  hint?: string;
}

/**
 * A section's styles, glued under its row: rolled out by its bar, every
 * style in a band, the current one ticked where the bars draw their icons. They stay out after a pick, so
 * the host can try several. Grouped styles roll out under their group's
 * heading, a band of its own, its arrow in the mark slot: the group holding
 * the current style out at first, the others in. Their bands in by one mark
 * slot, the heading's name in line with the bars' names.
 */
export function VariantBands<T extends string>({
  id,
  open,
  options,
  value,
  onPick,
  hint,
}: VariantBandsProps<T>) {
  const runs = groupRuns(options);
  const [shown, setShown] = useState<string[]>(() => {
    const picked = options.find((option) => option.value === value)?.group;
    return picked ? [picked] : [];
  });

  function toggle(group: string) {
    setShown(
      shown.includes(group)
        ? shown.filter((name) => name !== group)
        : [...shown, group],
    );
  }

  return (
    <RollPanel id={id} open={open}>
      <div className="flex flex-col overflow-hidden">
        {runs.map(({ group, options: run }) => {
          const bands = run.map((option) => (
            <StyleBand
              key={option.value}
              label={option.label}
              picked={option.value === value}
              indented={Boolean(group)}
              onPick={() => onPick(option.value)}
            />
          ));
          if (!group) return <Fragment key={run[0].value}>{bands}</Fragment>;
          const groupOpen = shown.includes(group);
          const groupId = `${id}-${run[0].value}`;
          return (
            <Fragment key={group}>
              <button
                type="button"
                aria-expanded={groupOpen}
                aria-controls={groupId}
                onClick={() => toggle(group)}
                className={`${DESIGN_BAND_BUTTON} font-medium text-neutral-800`}
              >
                <span className={MARK_SLOT}>
                  <Icon
                    name="chevron"
                    className={`${BOX_MARK} w-[22px] transition-transform ${groupOpen ? "rotate-180" : ""}`}
                  />
                </span>
                {group}
              </button>
              <RollPanel id={groupId} open={groupOpen}>
                <div className="flex flex-col overflow-hidden">{bands}</div>
              </RollPanel>
            </Fragment>
          );
        })}
        {hint ? <p className="hint-text mt-2">{hint}</p> : null}
      </div>
    </RollPanel>
  );
}

/** The options split where their group changes: each run one group's styles, or the ungrouped ones. */
function groupRuns<T extends string>(options: Option<T>[]) {
  const runs: { group?: string; options: Option<T>[] }[] = [];
  for (const option of options) {
    const last = runs.at(-1);
    if (last && last.group === option.group) last.options.push(option);
    else runs.push({ group: option.group, options: [option] });
  }
  return runs;
}

/** One style's band: the tick's place, then its name; in by one mark slot under a group. */
function StyleBand({
  label,
  picked,
  indented,
  onPick,
}: {
  label: string;
  picked: boolean;
  indented: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={picked}
      onClick={onPick}
      className={DESIGN_BAND_BUTTON}
    >
      {indented ? <span className={MARK_SLOT} /> : null}
      {/* The tick's place, kept empty when not picked. */}
      <span className={`${MARK_SLOT} h-[22px]`}>
        {picked ? (
          <Icon
            name="check"
            className={`${BOX_MARK} w-[22px]`}
            strokeWidth={BOX_MARK_STROKE}
          />
        ) : null}
      </span>
      <span className="min-w-0 [overflow-wrap:anywhere]">{label}</span>
    </button>
  );
}
