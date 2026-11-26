import type { VariantProps } from "@/types/modular";
import { VenueCardsSection } from "./VenueCards";

/** Cards soft: Cards hard (`6`) with the venues on the surface (`VenueCardsSection`). */
export function Variant({ values, ground }: VariantProps) {
  return <VenueCardsSection values={values} ground={ground} fill="surface" />;
}
