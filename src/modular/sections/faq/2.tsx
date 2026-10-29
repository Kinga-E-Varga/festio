import type { VariantProps } from "@/types/modular";
import { FaqSplit } from "./FaqSplit";

/** Icon & bars: the question mark over the heading beside the questions as bars. (`FaqSplit`) */
export function Variant({ values, ground }: VariantProps) {
  return <FaqSplit values={values} ground={ground} icon bars />;
}
