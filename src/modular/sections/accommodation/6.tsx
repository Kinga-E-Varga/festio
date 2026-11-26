import type { VariantProps } from "@/types/modular";
import { StayCards } from "./StayCards";

/** Cards hard: a card per stay on the second surface, the page's pattern round them (`StayCards`). */
export function Variant(props: VariantProps) {
  return <StayCards {...props} card="surface-alt" />;
}
