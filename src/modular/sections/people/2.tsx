import type { VariantProps } from "@/types/modular";
import { GroupCards } from "./GroupCards";

/** Cards hard: a card per group on the second surface, the page's pattern round them (`GroupCards`). */
export function Variant(props: VariantProps) {
  return <GroupCards {...props} card="surface-alt" />;
}
