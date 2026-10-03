import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A warm book serif for headings over a plain sans — close to Georgia + Arial. */
export const fontPair: FontPair = {
  id: "gelasio-arimo",
  name: "Gelasio & Arimo",
  fonts: { primary: fonts.arimo, secondary: fonts.gelasio },
};
