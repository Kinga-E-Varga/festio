import type { VariantProps } from "@/types/modular";
import { SectionCards } from "./CountdownCards";

/**
 * Cards soft: Cards hard (`2`) with the cards on the surface, bare as it is,
 * so the page's pattern shows round them (`SectionCards`).
 */
export function Variant(props: VariantProps) {
  return <SectionCards {...props} card="surface" />;
}
