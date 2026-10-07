import type { VariantProps } from "@/types/modular";
import { Calendar } from "./Calendar";

/** The heading beside a calendar card, the month over the day. */
export function Variant(props: VariantProps) {
  return <Calendar {...props} look="calendar" />;
}
