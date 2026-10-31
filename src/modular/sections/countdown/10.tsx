import type { VariantProps } from "@/types/modular";
import { SectionCards } from "./CountdownCards";

/** Cards (`2`) with the cards on the accent (`SectionCards`). */
export function Variant(props: VariantProps) {
  return <SectionCards {...props} accent />;
}
