import type { VariantProps } from "@/types/modular";
import { StickerDate } from "./StickerDate";

/** The date alone, as the title's stickers, in the ink. */
export function Variant(props: VariantProps) {
  return <StickerDate {...props} look="simple" />;
}
