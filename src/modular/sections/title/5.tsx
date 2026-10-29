import { TitleNames } from "@/modular/TitleNames";
import type { VariantProps } from "@/types/modular";

/** Sticker accent (`3`) in the ink, the middle part too. */
export function Variant(props: VariantProps) {
  return <TitleNames {...props} look="stickerInk" />;
}
