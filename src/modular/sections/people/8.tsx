import type { VariantProps } from "@/types/modular";
import { GroupCards } from "./GroupCards";

/** Cards (`2`) with the cards on the accent, every disc in the secondary (`GroupCards`). */
export function Variant(props: VariantProps) {
  return <GroupCards {...props} accent />;
}
