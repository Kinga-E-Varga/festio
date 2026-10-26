"use client";

import { type ReactNode, useState } from "react";
import { Icon } from "@/components/icons";
import type { IconName } from "@/types/dashboard";
import { RollArrow } from "./RollOut";
import { SectionBar } from "./SectionBar";
import {
  BOX_MARK,
  BOX_MARK_STROKE,
  SECTION_CARD as CARD,
  SECTION_REVEAL as REVEAL,
} from "./styles";
import { VariantBands } from "./VariantBands";

/**
 * A card like a Design section's whose bar rolls out a choice under it, as
 * a section's bar rolls out its styles: the down arrow, "Change" or "Close"
 * while hovered, the choices in bands, the current one ticked. They stay
 * out after a pick. With `rolls` false it is the bar alone. The envelope's
 * card and the print panel's card style.
 */
export function PickCard<T extends string>({
  id,
  label,
  mark,
  icon,
  name,
  options,
  value,
  onPick,
  rolls = true,
}: {
  /** The rolled-out bands' id. */
  id: string;
  /** What the bar's button says to screen readers. */
  label: string;
  /** In the mark slot: a switch, or else `icon`. */
  mark?: ReactNode;
  icon?: IconName;
  name: string;
  options: { value: T; label: string }[];
  value: T;
  onPick: (value: T) => void;
  rolls?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div className={`${CARD} group relative`}>
        {/* Laid first, so a switch in the mark is drawn over it. */}
        {rolls ? (
          <button
            type="button"
            data-reveal
            aria-label={label}
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen(!open)}
            className={REVEAL}
          />
        ) : null}
        <SectionBar
          mark={
            mark ??
            (icon ? (
              <Icon
                name={icon}
                className={`${BOX_MARK} w-[22px]`}
                strokeWidth={BOX_MARK_STROKE}
              />
            ) : null)
          }
          name={name}
          arrow={
            rolls ? (
              <RollArrow
                open={open}
                reveal="group-has-[[data-reveal]:focus-visible]:opacity-100"
              />
            ) : null
          }
        />
      </div>
      {rolls ? (
        <VariantBands
          id={id}
          open={open}
          options={options}
          value={value}
          onPick={onPick}
        />
      ) : null}
    </div>
  );
}
