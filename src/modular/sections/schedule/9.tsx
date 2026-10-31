import type { VariantProps } from "@/types/modular";
import { DayCards } from "./DayCards";

/** Cards (`5`) with the cards on the accent (`DayCards`). */
export function Variant(props: VariantProps) {
  return <DayCards {...props} accent />;
}
