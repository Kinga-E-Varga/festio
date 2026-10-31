import type { VariantProps } from "@/types/modular";
import { FullCardPeople } from "./FullCardPeople";

/** Full card (`7`) on the accent, no lines, every disc in the secondary (`FullCardPeople`). */
export function Variant(props: VariantProps) {
  return <FullCardPeople {...props} accent />;
}
