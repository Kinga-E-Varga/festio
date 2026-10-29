import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CourseList } from "./CourseList";

/**
 * A meal on its soft disc over the heading — no eyebrow — beside the
 * courses as Two-line & list's list, each numbered (`CourseList`).
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="meal" values={values} />
      <CourseList courses={list(values, "courses")} numbered />
    </div>
  );
}
