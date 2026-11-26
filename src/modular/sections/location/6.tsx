import type { VariantProps } from "@/types/modular";
import { VenueCardsSection } from "./VenueCards";

/** Cards hard: the location cards on the second surface (`VenueCardsSection`). */
export function Variant({ values, ground }: VariantProps) {
  return (
    <VenueCardsSection values={values} ground={ground} fill="surface-alt" />
  );
}
