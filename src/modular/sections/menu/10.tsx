import type { VariantProps } from "@/types/modular";
import { FullCardCourses } from "./FullCardCourses";

/** Full card (`8`) on the accent, Framed card's short line under the heading (`FullCardCourses`). */
export function Variant(props: VariantProps) {
  return <FullCardCourses {...props} accent />;
}
