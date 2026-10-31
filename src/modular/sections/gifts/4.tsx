import type { VariantProps } from "@/types/modular";
import { FullCardSection } from "./FullCardSection";

/** The full card alone (`FullCardSection`). */
export function Variant(props: VariantProps) {
  return <FullCardSection {...props} />;
}
