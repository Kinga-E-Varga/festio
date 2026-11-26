import type { VariantProps } from "@/types/modular";
import { VenueCardsSection } from "./VenueCards";

/** Cards accent: the location cards on the accent (`VenueCardsSection`). */
export function Variant({ values, ground }: VariantProps) {
  return <VenueCardsSection values={values} ground={ground} fill="accent" />;
}
