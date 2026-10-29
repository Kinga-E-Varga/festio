import { HeaderBar } from "@/modular/HeaderBar";
import type { VariantProps } from "@/types/modular";

/** Colourful accent: the mark in the accent, its middle in the secondary, plain links and an accent Reply button. */
export function Variant(props: VariantProps) {
  return <HeaderBar {...props} look="square" />;
}
