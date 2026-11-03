import { fonts } from "@/lib/fonts";
import type { FontPair } from "@/types/modular";

/** A blocky, all-capitals signage face for headings over a clean grotesque. */
export const fontPair: FontPair = {
  id: "bungee-archivo",
  name: "Bungee & Archivo",
  fonts: { primary: fonts.archivo, secondary: fonts.bungee },
  faceNames: { primary: "Archivo", secondary: "Bungee" },
};
