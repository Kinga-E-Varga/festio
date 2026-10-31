import type { VariantProps } from "@/types/modular";
import { GroupCards } from "./GroupCards";

/** A card per group on the other surface (`GroupCards`). */
export function Variant(props: VariantProps) {
  return <GroupCards {...props} />;
}
