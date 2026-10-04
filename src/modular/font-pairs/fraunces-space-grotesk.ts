import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A soft, old-style display serif for headings over a crisp geometric sans. */
export const fontPair: FontPair = {
  id: "fraunces-space-grotesk",
  name: "Fraunces & Space Grotesk",
  fonts: { primary: fonts.spaceGrotesk, secondary: fonts.fraunces },
  faceNames: { primary: "Space Grotesk", secondary: "Fraunces" },
};
