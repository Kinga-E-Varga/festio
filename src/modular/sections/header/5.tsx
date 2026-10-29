import { HeaderBar } from "@/modular/HeaderBar";
import type { VariantProps } from "@/types/modular";

/** Balanced (`2`) with the mark's middle and the Reply button in the accent. */
export function Variant(props: VariantProps) {
  return <HeaderBar {...props} look="roundedAccent" />;
}
