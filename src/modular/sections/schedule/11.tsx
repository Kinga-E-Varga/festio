import { FullCardFrame } from "@/modular/FullCard";
import { SectionHeading } from "@/modular/SectionHeading";
import { STACK, TIMELINE_HEADING } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { TimelineDays } from "./Timeline";

/**
 * Timeline (`4`) in a full card on the accent (`FullCardFrame`): the
 * heading centred over the timeline, no lines across the card, every disc
 * in the palette's own secondary.
 */
export function Variant({ values, language }: VariantProps) {
  return (
    <FullCardFrame ground="accent">
      <div className={STACK}>
        <div className={TIMELINE_HEADING}>
          <SectionHeading values={values} />
        </div>
        <TimelineDays values={values} language={language} accent />
      </div>
    </FullCardFrame>
  );
}
