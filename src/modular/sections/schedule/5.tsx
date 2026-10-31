import type { VariantProps } from "@/types/modular";
import { DayCards } from "./DayCards";

/** Each day a card on the other surface (`DayCards`). */
export function Variant(props: VariantProps) {
  return <DayCards {...props} />;
}
