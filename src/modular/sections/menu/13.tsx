import type { VariantProps } from "@/types/modular";
import { CourseCards } from "./CourseCards";

/** Cards soft: Cards hard (`6`) with the cards on the surface (`CourseCards`). */
export function Variant(props: VariantProps) {
  return <CourseCards {...props} card="surface" />;
}
