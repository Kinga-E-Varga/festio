import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A condensed gothic poster face, a little wider than Anton, for headings over a clean grotesque. */
export const fontPair: FontPair = {
  id: "oswald-archivo",
  name: "Oswald & Archivo",
  fonts: { primary: fonts.archivo, secondary: fonts.oswald },
  faceNames: { primary: "Archivo", secondary: "Oswald" },
};
