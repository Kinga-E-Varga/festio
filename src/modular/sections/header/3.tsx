import { HeaderBar } from "@/modular/HeaderBar";
import type { VariantProps } from "@/types/modular";

/** Balanced, with the whole mark in the ink — its middle too. */
export function Variant(props: VariantProps) {
  return <HeaderBar {...props} look="plain" />;
}
