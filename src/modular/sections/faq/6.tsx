import type { VariantProps } from "@/types/modular";
import { FullCardFaq } from "./FullCardFaq";

/** The questions in a full card, a line between each (`FullCardFaq`). */
export function Variant(props: VariantProps) {
  return <FullCardFaq {...props} />;
}
