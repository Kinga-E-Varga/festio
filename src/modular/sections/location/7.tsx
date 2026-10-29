import type { VariantProps } from "@/types/modular";
import { VenueRows, labelLead } from "./VenueRows";

/**
 * Simple with each location's name as a two-line heading: its detail first,
 * the name under it in italic, the label over both (`VenueRows`, `Venue`).
 */
export function Variant({ values, ground }: VariantProps) {
  return <VenueRows values={values} ground={ground} lead={labelLead} twoLine />;
}
