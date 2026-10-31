import type { VariantProps } from "@/types/modular";
import { FullCardWays } from "./FullCardWays";

/** Full card (`8`) on the accent, no lines, every disc in the secondary (`FullCardWays`). */
export function Variant(props: VariantProps) {
  return <FullCardWays {...props} accent />;
}
