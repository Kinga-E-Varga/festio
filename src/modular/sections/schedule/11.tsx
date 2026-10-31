import { FullCardFrame } from "@/modular/FullCard";
import { SectionHeading } from "@/modular/SectionHeading";
import { STACK } from "@/modular/styles";
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
        <SectionHeading values={values} />
        <TimelineDays values={values} language={language} accent />
      </div>
    </FullCardFrame>
  );
}
