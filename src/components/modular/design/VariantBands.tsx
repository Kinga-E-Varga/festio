"use client";

import { Icon } from "@/components/icons";
import { RollPanel } from "./RollOut";
import { DESIGN_BAND } from "./styles";

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
 * style in a band, the current one ticked. They stay out after a pick, so
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
              <span className="min-w-0 [overflow-wrap:anywhere]">
                {option.label}
              </span>
              {picked ? (
                <Icon name="check" className="size-4 shrink-0" />
              ) : null}
            </button>
          );
        })}
      </div>
    </RollPanel>
  );
}
