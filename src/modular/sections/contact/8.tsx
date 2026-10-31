import type { VariantProps } from "@/types/modular";
import { PeopleCards } from "./PeopleCards";

/** Cards (`1`) with the cards on the accent, every disc in the secondary (`PeopleCards`). */
export function Variant(props: VariantProps) {
  return <PeopleCards {...props} accent />;
}
