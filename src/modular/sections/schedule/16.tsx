import type { VariantProps } from "@/types/modular";
import { DayCards } from "./DayCards";

/** Cards soft: Cards hard (`5`) with the cards on the surface (`DayCards`). */
export function Variant(props: VariantProps) {
  return <DayCards {...props} card="surface" />;
}
