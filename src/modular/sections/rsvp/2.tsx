import type { VariantProps } from "@/types/modular";
import { BoldBand } from "./BoldBand";

/** On the tertiary (`BoldBand`). */
export function Variant(props: VariantProps) {
  return <BoldBand {...props} tone="tertiary" />;
}
