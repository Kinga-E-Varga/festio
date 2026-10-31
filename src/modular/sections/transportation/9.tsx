import type { VariantProps } from "@/types/modular";
import { WayCards } from "./WayCards";

/** Cards (`1`) with the cards on the accent, every disc in the secondary (`WayCards`). */
export function Variant(props: VariantProps) {
  return <WayCards {...props} accent />;
}
