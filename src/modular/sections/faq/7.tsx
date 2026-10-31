import type { VariantProps } from "@/types/modular";
import { FullCardFaq } from "./FullCardFaq";

/** Full card (`6`) on the accent, no lines (`FullCardFaq`). */
export function Variant(props: VariantProps) {
  return <FullCardFaq {...props} accent />;
}
