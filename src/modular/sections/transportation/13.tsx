import type { VariantProps } from "@/types/modular";
import { WayCards } from "./WayCards";

/** Cards soft: Cards hard (`1`) with the cards on the surface (`WayCards`). */
export function Variant(props: VariantProps) {
  return <WayCards {...props} card="surface" />;
}
