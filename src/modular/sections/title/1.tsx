import { TitleNames } from "@/modular/TitleNames";
import type { VariantProps } from "@/types/modular";

/** The names in the accent. */
export function Variant(props: VariantProps) {
  return <TitleNames {...props} look="colorful" />;
}
