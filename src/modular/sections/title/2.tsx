import { TitleNames } from "@/modular/TitleNames";
import type { VariantProps } from "@/types/modular";

/** The names in the ink. */
export function Variant(props: VariantProps) {
  return <TitleNames {...props} look="plain" />;
}
