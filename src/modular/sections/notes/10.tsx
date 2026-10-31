import type { VariantProps } from "@/types/modular";
import { NoteTilesSection } from "./NoteTiles";

/** Cards (`8`) with the cards on the accent, every disc in the secondary (`NoteTilesSection`). */
export function Variant(props: VariantProps) {
  return <NoteTilesSection {...props} look="cards" accent />;
}
