import type { VariantProps } from "@/types/modular";
import { NoteTilesSection } from "./NoteTiles";

/** The notes as cards side by side, on the other surface (`NoteTilesSection`). */
export function Variant(props: VariantProps) {
  return <NoteTilesSection {...props} look="cards" />;
}
