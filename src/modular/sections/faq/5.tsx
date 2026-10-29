import type { VariantProps } from "@/types/modular";
import { FaqSplit } from "./FaqSplit";

/** Icon & list: the question mark over the heading beside the questions as rows between hairlines. (`FaqSplit`) */
export function Variant({ values, ground }: VariantProps) {
  return <FaqSplit values={values} ground={ground} icon />;
}
