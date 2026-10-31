import type { VariantProps } from "@/types/modular";
import { VenueRows, labelLead } from "./VenueRows";

/** Simple (`2`) on the accent: the band's ink stands in for every role (`VenueRows`). */
export function Variant({ values, ground }: VariantProps) {
  return <VenueRows values={values} ground={ground} lead={labelLead} />;
}
