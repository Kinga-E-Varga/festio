import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CourseList } from "./CourseList";

/**
 * The two-line heading beside the courses as a list between hairlines
 * (`CourseList`): each course's label over its dishes and note.
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <CourseList courses={list(values, "courses")} />
    </div>
  );
}
