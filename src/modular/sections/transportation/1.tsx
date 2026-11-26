import type { VariantProps } from "@/types/modular";
import { WayCards } from "./WayCards";

/** Cards hard: one card per way of arriving on the second surface, the page's pattern round them (`WayCards`). */
export function Variant(props: VariantProps) {
  return <WayCards {...props} card="surface-alt" />;
}
