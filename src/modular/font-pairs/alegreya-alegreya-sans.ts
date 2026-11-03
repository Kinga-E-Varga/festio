import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A sturdy, calligraphic book serif for headings over its own sister sans. */
export const fontPair: FontPair = {
  id: "alegreya-alegreya-sans",
  name: "Alegreya & Alegreya Sans",
  fonts: { primary: fonts.alegreyaSans, secondary: fonts.alegreya },
  faceNames: { primary: "Alegreya Sans", secondary: "Alegreya" },
};
