import type { VariantProps } from "@/types/modular";
import { FullCardPeople } from "./FullCardPeople";

/** The people side by side in a full card (`FullCardPeople`). */
export function Variant(props: VariantProps) {
  return <FullCardPeople {...props} />;
}
