"use client";

import { Fragment } from "react";
import { Icon } from "@/components/icons";
import { RollPanel } from "./RollOut";
import {
  BOX_MARK,
  BOX_MARK_STROKE,
  DESIGN_BAND,
  DESIGN_BAND_BUTTON,
  MARK_SLOT,
} from "./styles";

interface VariantBandsProps<T extends string> {
  /** The rolled-out bands' id, for the arrow that opens them. */
  id: string;
  open: boolean;
  /** In order; options in one group follow each other. */
  options: { value: T; label: string; group?: string }[];
  value: T;
  onPick: (value: T) => void;
  /** A line under the bands, rolled out with them. */
  hint?: string;
}

/**
 * A section's styles, glued under its row: rolled out by its bar, every
 * style in a band, the current one ticked where the bars draw their icons. They stay out after a pick, so
 * the host can try several. Grouped styles sit under their group's heading,
 * in by one mark slot, the heading's name in line with the bars' names.
 */
export function VariantBands<T extends string>({
  id,
  open,
  options,
  value,
  onPick,
  hint,
}: VariantBandsProps<T>) {
  return (
    <RollPanel id={id} open={open}>
      <div className="flex flex-col overflow-hidden">
        {options.map((option, index) => {
          const picked = option.value === value;
          const heading =
            option.group && option.group !== options[index - 1]?.group;
          return (
            <Fragment key={option.value}>
              {heading ? (
                <p className={`${DESIGN_BAND} font-medium text-neutral-800`}>
                  <span className={MARK_SLOT} />
                  {option.group}
                </p>
              ) : null}
              <button
                type="button"
                aria-pressed={picked}
                onClick={() => onPick(option.value)}
                className={DESIGN_BAND_BUTTON}
              >
                {option.group ? <span className={MARK_SLOT} /> : null}
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
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  {option.label}
                </span>
              </button>
            </Fragment>
          );
        })}
        {hint ? <p className="hint-text mt-2">{hint}</p> : null}
      </div>
    </RollPanel>
  );
}
