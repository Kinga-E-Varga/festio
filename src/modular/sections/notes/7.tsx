import type { VariantProps } from "@/types/modular";
import { NoteTilesSection } from "./NoteTiles";

/** The notes side by side, no lines, each icon over its label; on the accent, Grid accent (`11`) (`NoteTilesSection`). */
export function Variant(props: VariantProps) {
  return (
    <NoteTilesSection
      {...props}
      look="grid"
      accent={props.ground === "accent"}
    />
  );
}
