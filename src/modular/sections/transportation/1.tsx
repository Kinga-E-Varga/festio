import type { VariantProps } from "@/types/modular";
import { WayCards } from "./WayCards";

/** One card per way of arriving, on the other surface (`WayCards`). */
export function Variant(props: VariantProps) {
  return <WayCards {...props} />;
}
