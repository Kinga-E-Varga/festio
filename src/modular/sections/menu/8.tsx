import type { VariantProps } from "@/types/modular";
import { FullCardCourses } from "./FullCardCourses";

/** The courses in a full card (`FullCardCourses`). */
export function Variant(props: VariantProps) {
  return <FullCardCourses {...props} />;
}
