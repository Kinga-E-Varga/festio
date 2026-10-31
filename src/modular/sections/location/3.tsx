import type { VariantProps } from "@/types/modular";
import { ListGridVenues } from "./ListGridVenues";

/** The locations as a list, or side by side without photos (`ListGridVenues`). */
export function Variant(props: VariantProps) {
  return <ListGridVenues {...props} />;
}
