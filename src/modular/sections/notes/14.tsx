import type { VariantProps } from "@/types/modular";
import { NoteTilesSection } from "./NoteTiles";

/** Cards soft: Cards hard (`8`) with the cards on the surface (`NoteTilesSection`). */
export function Variant(props: VariantProps) {
  return <NoteTilesSection {...props} look="cards" card="surface" />;
}
