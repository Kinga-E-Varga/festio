import type { VariantProps } from "@/types/modular";
import { ListGridVenues } from "./ListGridVenues";

/** Grid (`3`) on the accent (`ListGridVenues`). */
export function Variant(props: VariantProps) {
  return <ListGridVenues {...props} accent />;
}
