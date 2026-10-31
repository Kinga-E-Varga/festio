import type { VariantProps } from "@/types/modular";
import { StayCards } from "./StayCards";

/** Transportation's Cards for the stays, on the other surface (`StayCards`). */
export function Variant(props: VariantProps) {
  return <StayCards {...props} />;
}
