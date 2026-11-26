import type { VariantProps } from "@/types/modular";
import { JoinedCards } from "./CountdownCards";

/** Cards joined hard: cards in the date's band (`JoinedCards`), always on the second surface (`surface-alt`). */
export function Variant(props: VariantProps) {
  return <JoinedCards {...props} card="surface-alt" />;
}
