import type { VariantProps } from "@/types/modular";
import { FullCardStory } from "./FullCardStory";

/** The story as a full card, the photo beside it (`FullCardStory`). */
export function Variant(props: VariantProps) {
  return <FullCardStory {...props} />;
}
