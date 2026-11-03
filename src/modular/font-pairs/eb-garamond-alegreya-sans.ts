import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A classic book serif with a real italic for headings over a warm humanist sans. */
export const fontPair: FontPair = {
  id: "eb-garamond-alegreya-sans",
  name: "EB Garamond & Alegreya Sans",
  fonts: { primary: fonts.alegreyaSans, secondary: fonts.ebGaramond },
  faceNames: { primary: "Alegreya Sans", secondary: "EB Garamond" },
};
