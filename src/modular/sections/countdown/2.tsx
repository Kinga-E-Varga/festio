import type { VariantProps } from "@/types/modular";
import { SectionCards } from "./CountdownCards";

/**
 * Each unit in a card, a section of its own (`SectionCards`), bare as the
 * Text box's Card: the page paints no band, so its pattern shows round the
 * cards; the cards always on the second surface (`surface-alt`).
 */
export function Variant(props: VariantProps) {
  return <SectionCards {...props} card="surface-alt" />;
}
