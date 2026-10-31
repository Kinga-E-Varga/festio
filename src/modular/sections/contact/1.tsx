import type { VariantProps } from "@/types/modular";
import { PeopleCards } from "./PeopleCards";

/** A card per person on the other surface (`PeopleCards`). */
export function Variant(props: VariantProps) {
  return <PeopleCards {...props} />;
}
