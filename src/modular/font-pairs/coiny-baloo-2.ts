import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A round, chunky, playful face for headings over a sturdy rounded sans. */
export const fontPair: FontPair = {
  id: "coiny-baloo-2",
  name: "Coiny & Baloo 2",
  fonts: { primary: fonts.baloo, secondary: fonts.coiny },
  faceNames: { primary: "Baloo 2", secondary: "Coiny" },
};
