import type { VariantProps } from "@/types/modular";
import { Calendar } from "./Calendar";

/** The heading beside a tear-off calendar page: the month on an accent strip. */
export function Variant(props: VariantProps) {
  return <Calendar {...props} look="tearOff" />;
}
