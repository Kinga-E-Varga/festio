import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SECTION_GROUND, STACK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CourseCard } from "./MenuCard";

/**
 * On the accent band: the heading centred — no italic line — over Icon &
 * card's menu card (`CourseCard`), the card on the surface, as wide as
 * the section's content, with Framed card's double frame, the outer hairline in the accent.
 */
export function Variant({ values, ground }: VariantProps) {
  const courses = list(values, "courses");

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {courses.length > 0 ? (
        <CourseCard courses={courses} ground={ground} accent />
      ) : null}
    </div>
  );
}
