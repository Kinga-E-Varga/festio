import type { VariantProps } from "@/types/modular";
import { NoteTilesSection } from "./NoteTiles";

/** Cards hard: the notes as cards side by side, on the second surface (`NoteTilesSection`). */
export function Variant(props: VariantProps) {
  return <NoteTilesSection {...props} look="cards" card="surface-alt" />;
}
