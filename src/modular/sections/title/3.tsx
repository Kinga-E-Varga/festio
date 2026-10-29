import { TitleNames } from "@/modular/TitleNames";
import type { VariantProps } from "@/types/modular";

/** Plain's names and title line alone, in the accent (the middle part too), medium, cut out of a pattern. */
export function Variant(props: VariantProps) {
  return <TitleNames {...props} look="sticker" />;
}
