import type { VariantProps } from "@/types/modular";
import { NoteTilesSection } from "./NoteTiles";

/** The notes as a grid between hairlines; on the accent (Accent, `11`) without them, the icons back (`NoteTilesSection`). */
export function Variant(props: VariantProps) {
  return (
    <NoteTilesSection
      {...props}
      look="grid"
      accent={props.ground === "accent"}
    />
  );
}
