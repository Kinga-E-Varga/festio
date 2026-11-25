import type { VariantProps } from "@/types/modular";
import { BandFooter } from "./Band";

/** Colourful (`1`) with the date in the accent (`BandFooter`). */
export function Variant(props: VariantProps) {
  return <BandFooter {...props} inks="colourfulAccent" />;
}
