import type { VariantProps } from "@/types/modular";
import { FullCardVenues } from "./FullCardVenues";

/** Grid (`3`) as a full card (`FullCardVenues`). */
export function Variant(props: VariantProps) {
  return <FullCardVenues {...props} />;
}
