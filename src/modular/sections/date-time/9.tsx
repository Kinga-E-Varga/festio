import type { VariantProps } from "@/types/modular";
import { StickerDate } from "./StickerDate";

/** The date alone, as the title's stickers, in the accent. */
export function Variant(props: VariantProps) {
  return <StickerDate {...props} look="colorful" />;
}
