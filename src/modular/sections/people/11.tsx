import type { VariantProps } from "@/types/modular";
import { FullCardGroups } from "./FullCardGroups";

/** The groups side by side in a full card (`FullCardGroups`). */
export function Variant(props: VariantProps) {
  return <FullCardGroups {...props} />;
}
