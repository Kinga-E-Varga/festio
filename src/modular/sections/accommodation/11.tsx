import type { VariantProps } from "@/types/modular";
import { FullCardStays } from "./FullCardStays";

/** The stays side by side in a full card (`FullCardStays`). */
export function Variant(props: VariantProps) {
  return <FullCardStays {...props} />;
}
