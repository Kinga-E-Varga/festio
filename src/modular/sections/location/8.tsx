import type { VariantProps } from "@/types/modular";
import { FullCardVenues } from "./FullCardVenues";

/** List & grid (`3`) as a full card (`FullCardVenues`). */
export function Variant(props: VariantProps) {
  return <FullCardVenues {...props} />;
}
