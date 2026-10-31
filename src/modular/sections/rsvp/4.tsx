import type { VariantProps } from "@/types/modular";
import { BoldBand } from "./BoldBand";

/** Bold band (`2`) on the secondary (`BoldBand`). */
export function Variant(props: VariantProps) {
  return <BoldBand {...props} tone="secondary" />;
}
