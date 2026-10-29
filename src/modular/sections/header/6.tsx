import { HeaderBar } from "@/modular/HeaderBar";
import type { VariantProps } from "@/types/modular";

/** Colourful accent (`1`) with the Reply button in the secondary. */
export function Variant(props: VariantProps) {
  return <HeaderBar {...props} look="colorful" />;
}
