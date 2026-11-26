import type { VariantProps } from "@/types/modular";
import { CentredStory } from "./CentredStory";

/** On the accent band, as the other Accent styles (`CentredStory`). */
export function Variant(props: VariantProps) {
  return <CentredStory {...props} />;
}
