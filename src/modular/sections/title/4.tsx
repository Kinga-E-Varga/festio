import { TitleNames } from "@/modular/TitleNames";
import type { VariantProps } from "@/types/modular";

/** Sticker in Colourful's colours: the accent, the mark in the secondary. */
export function Variant(props: VariantProps) {
  return <TitleNames {...props} look="colorfulSticker" />;
}
