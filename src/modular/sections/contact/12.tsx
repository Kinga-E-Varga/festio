import type { VariantProps } from "@/types/modular";
import { PeopleCards } from "./PeopleCards";

/** Cards soft: Cards hard (`1`) with the cards on the surface (`PeopleCards`). */
export function Variant(props: VariantProps) {
  return <PeopleCards {...props} card="surface" />;
}
