import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** The Wolf Dance fonts: a script for headings over a quiet serif. */
export const fontPair: FontPair = {
  id: "script",
  name: "Script",
  fonts: { primary: fonts.notoSerif, secondary: fonts.kapakana },
};
