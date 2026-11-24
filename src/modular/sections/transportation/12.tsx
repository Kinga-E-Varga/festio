import type { VariantProps } from "@/types/modular";
import { FullCardWays } from "./FullCardWays";

/** The ways of arriving side by side in a full card (`FullCardWays`). */
export function Variant(props: VariantProps) {
  return <FullCardWays {...props} />;
}
