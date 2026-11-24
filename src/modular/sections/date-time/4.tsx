import { FullCardFrame } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { BandDate } from "./BandDate";

/**
 * Full card accent: Simple accent's date and note (`BandDate`) in one card
 * on the accent (`FullCardFrame`) rather than across the band.
 */
export function Variant({ values, basics, language }: VariantProps) {
  return (
    <FullCardFrame ground="accent">
      <BandDate values={values} basics={basics} language={language} />
    </FullCardFrame>
  );
}
