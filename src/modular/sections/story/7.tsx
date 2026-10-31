import type { VariantProps } from "@/types/modular";
import { FullCardStory } from "./FullCardStory";

/** Full card (`6`) on the accent, no lines (`FullCardStory`). */
export function Variant(props: VariantProps) {
  return <FullCardStory {...props} accent />;
}
