import type { VariantProps } from "@/types/modular";
import { BandFooter } from "./Band";

/** Accent's footer on the page's surface, in its ink (`BandFooter`). */
export function Variant(props: VariantProps) {
  return <BandFooter {...props} />;
}
