import { HeaderBar } from "@/modular/HeaderBar";
import type { VariantProps } from "@/types/modular";

/** Simple (`3`) with the Reply button in the accent. */
export function Variant(props: VariantProps) {
  return <HeaderBar {...props} look="plainAccent" />;
}
