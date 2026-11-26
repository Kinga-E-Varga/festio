import type { VariantProps } from "@/types/modular";
import { CourseCards } from "./CourseCards";

/** Cards hard (`6`) with the cards on the accent, every disc in the secondary (`CourseCards`). */
export function Variant(props: VariantProps) {
  return <CourseCards {...props} accent />;
}
