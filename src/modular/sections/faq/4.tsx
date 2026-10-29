import type { VariantProps } from "@/types/modular";
import { FaqSplit } from "./FaqSplit";

/** Two-line & bars: the two-line heading beside the questions as bars. (`FaqSplit`) */
export function Variant({ values, ground }: VariantProps) {
  return <FaqSplit values={values} ground={ground} bars />;
}
