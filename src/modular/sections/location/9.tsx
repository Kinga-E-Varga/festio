import type { VariantProps } from "@/types/modular";
import { ListGridVenues } from "./ListGridVenues";

/** List & grid (`3`) on the accent, no lines, each venue's icon over its label (`ListGridVenues`). */
export function Variant(props: VariantProps) {
  return <ListGridVenues {...props} accent />;
}
