import { HeaderBar } from "@/modular/HeaderBar";
import type { VariantProps } from "@/types/modular";

/** The header with the mark in the heading face, in the ink, and a secondary Reply button. */
export function Variant(props: VariantProps) {
  return <HeaderBar {...props} look="rounded" />;
}
