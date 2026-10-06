import { TitleNames } from "@/modular/TitleNames";
import type { VariantProps } from "@/types/modular";

/** The names, with nothing above. */
export function Variant(props: VariantProps) {
  return <TitleNames {...props} look="plain" />;
}
