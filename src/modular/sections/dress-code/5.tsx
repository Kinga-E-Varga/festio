import type { VariantProps } from "@/types/modular";
import { FullCardSection } from "./FullCardSection";

/** Full card (`4`) on the accent, the icon on the palette's secondary disc (`FullCardSection`). */
export function Variant(props: VariantProps) {
  return <FullCardSection {...props} accent />;
}
