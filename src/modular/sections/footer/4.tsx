import type { VariantProps } from "@/types/modular";
import { BandFooter } from "./Band";

/** Balanced (`5`) with the mark's middle and the date in the accent (`BandFooter`). */
export function Variant(props: VariantProps) {
  return <BandFooter {...props} inks="balancedAccent" />;
}
