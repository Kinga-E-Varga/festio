import type { VariantProps } from "@/types/modular";
import { VenueRows, labelLead } from "./VenueRows";

/** Each location's label over its name, in the secondary (`VenueRows`). */
export function Variant({ values, ground }: VariantProps) {
  return <VenueRows values={values} ground={ground} lead={labelLead} />;
}
