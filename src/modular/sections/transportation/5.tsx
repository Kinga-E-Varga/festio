import type { VariantProps } from "@/types/modular";
import { TwoLineWays } from "./TwoLineWays";

/** Two-line & list (`3`) with each way a card on the other surface, stacked (`TwoLineWays`). */
export function Variant({ values, ground }: VariantProps) {
  return <TwoLineWays values={values} ground={ground} cards />;
}
