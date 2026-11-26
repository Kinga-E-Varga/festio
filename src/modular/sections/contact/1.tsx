import type { VariantProps } from "@/types/modular";
import { PeopleCards } from "./PeopleCards";

/** Cards hard: a card per person on the second surface, the page's pattern round them (`PeopleCards`). */
export function Variant(props: VariantProps) {
  return <PeopleCards {...props} card="surface-alt" />;
}
