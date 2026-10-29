import type { VariantProps } from "@/types/modular";
import { TwoLineWays } from "./TwoLineWays";

/** The two-line heading beside the ways as a list between hairlines (`TwoLineWays`). */
export function Variant({ values, ground }: VariantProps) {
  return <TwoLineWays values={values} ground={ground} />;
}
