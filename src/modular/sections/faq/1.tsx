import type { VariantProps } from "@/types/modular";
import { FaqSplit } from "./FaqSplit";

/** Two-line & list: the two-line heading beside the questions as rows between hairlines. (`FaqSplit`) */
export function Variant({ values, ground }: VariantProps) {
  return <FaqSplit values={values} ground={ground} />;
}
