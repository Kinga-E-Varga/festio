import type { VariantProps } from "@/types/modular";
import { GroupCards } from "./GroupCards";

/** Cards soft: Cards hard (`2`) with the cards on the surface (`GroupCards`). */
export function Variant(props: VariantProps) {
  return <GroupCards {...props} card="surface" />;
}
