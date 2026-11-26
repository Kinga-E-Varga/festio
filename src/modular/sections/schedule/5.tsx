import type { VariantProps } from "@/types/modular";
import { DayCards } from "./DayCards";

/** Cards hard: each day a card on the second surface, the page's pattern round them (`DayCards`). */
export function Variant(props: VariantProps) {
  return <DayCards {...props} card="surface-alt" />;
}
