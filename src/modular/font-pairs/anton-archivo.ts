import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A loud, condensed poster face for headings over a clean grotesque. */
export const fontPair: FontPair = {
  id: "anton-archivo",
  name: "Anton & Archivo",
  fonts: { primary: fonts.archivo, secondary: fonts.anton },
  faceNames: { primary: "Archivo", secondary: "Anton" },
};
