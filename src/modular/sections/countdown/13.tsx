import type { VariantProps } from "@/types/modular";
import { JoinedCards } from "./CountdownCards";

/** Cards joined soft: Cards joined hard (`7`) with the cards on the surface (`JoinedCards`). */
export function Variant(props: VariantProps) {
  return <JoinedCards {...props} card="surface" />;
}
