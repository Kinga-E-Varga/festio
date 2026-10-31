import type { VariantProps } from "@/types/modular";
import { SectionCards } from "./CountdownCards";

/** Each unit in a card on the other surface, a section of its own (`SectionCards`). */
export function Variant(props: VariantProps) {
  return <SectionCards {...props} />;
}
