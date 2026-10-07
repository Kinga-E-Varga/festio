"use client";

import { Icon } from "@/components/icons";
import { RollPanel } from "./RollOut";
import { BOX_MARK, BOX_MARK_STROKE, DESIGN_BAND } from "./styles";

interface VariantBandsProps<T extends string> {
  /** The rolled-out bands' id, for the arrow that opens them. */
  id: string;
  open: boolean;
  options: { value: T; label: string }[];
  value: T;
  onPick: (value: T) => void;
}

/**
 * A section's styles, glued under its row: rolled out by its bar, every
 * style in a band, the current one ticked where the bars draw their icons. They stay out after a pick, so
 * the host can try several.
 */
export function VariantBands<T extends string>({
  id,
  open,
  options,
  value,
  onPick,
}: VariantBandsProps<T>) {
  return (
    <RollPanel id={id} open={open}>
      <div className="flex flex-col overflow-hidden">
        {options.map((option) => {
          const picked = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={picked}
              onClick={() => onPick(option.value)}
              className={DESIGN_BAND}
            >
              {/* The tick's place, kept empty when not picked. */}
              <span className={`${BOX_MARK} flex w-[22px]`}>
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
          );
        })}
      </div>
    </RollPanel>
  );
}
