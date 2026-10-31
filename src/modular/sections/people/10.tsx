import type { VariantProps } from "@/types/modular";
import { FullCardGroups } from "./FullCardGroups";

/** Full card (`7`) on the accent, no lines, every disc in the secondary (`FullCardGroups`). */
export function Variant(props: VariantProps) {
  return <FullCardGroups {...props} accent />;
}
