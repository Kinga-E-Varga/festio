import type { VariantProps } from "@/types/modular";
import { StayCards } from "./StayCards";

/** Cards hard (`6`) with the cards on the accent, every disc in the secondary (`StayCards`). */
export function Variant(props: VariantProps) {
  return <StayCards {...props} accent />;
}
