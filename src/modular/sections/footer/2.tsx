import type { VariantProps } from "@/types/modular";
import { BandFooter } from "./Band";

/** The page closes on the accent, in its ink (`BandFooter`). */
export function Variant(props: VariantProps) {
  return <BandFooter {...props} />;
}
