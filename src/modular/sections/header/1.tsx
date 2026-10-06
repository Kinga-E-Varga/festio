import { HeaderBar } from "@/modular/HeaderBar";
import type { VariantProps } from "@/types/modular";

/** The header with a display mark, plain links and an accent Reply button. */
export function Variant(props: VariantProps) {
  return <HeaderBar {...props} look="square" />;
}
