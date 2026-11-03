import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A warm, calm old-style serif with a real italic for headings over a humanist sans. */
export const fontPair: FontPair = {
  id: "castoro-source-sans-3",
  name: "Castoro & Source Sans 3",
  fonts: { primary: fonts.sourceSans, secondary: fonts.castoro },
  faceNames: { primary: "Source Sans 3", secondary: "Castoro" },
};
