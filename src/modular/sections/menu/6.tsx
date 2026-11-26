import type { VariantProps } from "@/types/modular";
import { CourseCards } from "./CourseCards";

/** Cards hard: a card per course on the second surface, the page's pattern round them (`CourseCards`). */
export function Variant(props: VariantProps) {
  return <CourseCards {...props} card="surface-alt" />;
}
