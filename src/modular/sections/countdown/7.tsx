import type { VariantProps } from "@/types/modular";
import { JoinedCards } from "./CountdownCards";

/** Cards in the date's band (`JoinedCards`), on the other surface. */
export function Variant(props: VariantProps) {
  return <JoinedCards {...props} />;
}
