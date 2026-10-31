import type { VariantProps } from "@/types/modular";
import { CourseCards } from "./CourseCards";

/** A card per course on the other surface (`CourseCards`). */
export function Variant(props: VariantProps) {
  return <CourseCards {...props} />;
}
