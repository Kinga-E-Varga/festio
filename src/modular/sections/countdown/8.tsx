import type { VariantProps } from "@/types/modular";
import { JoinedCards } from "./CountdownCards";

/** Cards joined (`7`) with the cards on the accent (`JoinedCards`). */
export function Variant(props: VariantProps) {
  return <JoinedCards {...props} accent />;
}
