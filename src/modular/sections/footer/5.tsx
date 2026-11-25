import type { VariantProps } from "@/types/modular";
import { BandFooter } from "./Band";

/** Simple's footer (`BandFooter`), the mark in the ink, its middle and the date in the secondary. */
export function Variant(props: VariantProps) {
  return <BandFooter {...props} inks="balanced" />;
}
