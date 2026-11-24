import { FullCardFrame } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { BandDate } from "./BandDate";

/**
 * Full card hard: the date and note (`BandDate`) in one card in the full cards'
 * fill (`CARD_FILL`), here the second surface (the variant's `card`).
 */
export function Variant({ values, basics, language, ground }: VariantProps) {
  return (
    <FullCardFrame ground={ground}>
      <BandDate values={values} basics={basics} language={language} />
    </FullCardFrame>
  );
}
