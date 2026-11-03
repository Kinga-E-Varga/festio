import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A heavy, poster-like slab serif for headings over a calm humanist sans. */
export const fontPair: FontPair = {
  id: "bevan-source-sans-3",
  name: "Bevan & Source Sans 3",
  fonts: { primary: fonts.sourceSans, secondary: fonts.bevan },
  faceNames: { primary: "Source Sans 3", secondary: "Bevan" },
};
