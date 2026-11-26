import type { VariantProps } from "@/types/modular";
import { StayCards } from "./StayCards";

/** Cards soft: Cards hard (`6`) with the cards on the surface (`StayCards`). */
export function Variant(props: VariantProps) {
  return <StayCards {...props} card="surface" />;
}
