import type { VariantProps } from "@/types/modular";
import { FullCardVenues } from "./FullCardVenues";

/** Full card (`8`) on the accent, every icon in the secondary (`FullCardVenues`). */
export function Variant(props: VariantProps) {
  return <FullCardVenues {...props} accent />;
}
