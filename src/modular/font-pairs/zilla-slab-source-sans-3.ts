import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A sturdy slab serif for headings over a light, humanist sans. */
export const fontPair: FontPair = {
  id: "zilla-slab-source-sans-3",
  name: "Zilla Slab & Source Sans 3",
  fonts: { primary: fonts.sourceSans, secondary: fonts.zillaSlab },
  faceNames: { primary: "Source Sans 3", secondary: "Zilla Slab" },
};
