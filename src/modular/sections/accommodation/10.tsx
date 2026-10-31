import type { VariantProps } from "@/types/modular";
import { FullCardStays } from "./FullCardStays";

/** Full card (`7`) on the accent, no lines, every disc in the secondary (`FullCardStays`). */
export function Variant(props: VariantProps) {
  return <FullCardStays {...props} accent />;
}
