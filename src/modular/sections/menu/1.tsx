import { pad } from "@/lib/event";
import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  H4,
  H3_ITEM,
  INNER_EYEBROW,
  LINED_CELL,
  LINED_GRID,
  MUTED,
  PAD,
  STACK,
  columnsFor,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Dishes, dishesOf } from "./Dishes";

/**
 * Up to six courses side by side (rows of three past four), numbered, with
 * hairlines between them (`LINED_GRID`), each course's dishes one under
 * another, a dot between them, more room under several. One column on a phone.
 */
export function Variant({ values, ground }: VariantProps) {
  const courses = list(values, "courses").slice(0, 6);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {courses.length > 0 ? (
        <ol className={`${LINED_GRID} ${columnsFor(courses.length)}`}>
          {courses.map((course, index) => (
            <li
              key={index}
              className={`${LINED_CELL} flex flex-col items-center justify-start ${SECTION_GROUND[ground]} px-5 py-8 text-center @3xl:py-10`}
            >
              <span className={`${H4} text-[color:var(--m-accent)]`}>
                {pad(index + 1)}
              </span>
              {course.label ? (
                <span
                  className={`${INNER_EYEBROW} mt-3 text-[color:var(--m-secondary)]`}
                >
                  {course.label}
                </span>
              ) : null}
              {course.title ? (
                <Dishes
                  title={course.title}
                  className={`${H3_ITEM} mt-4 ${dishesOf(course.title).length > 1 ? "mb-3" : "mb-1"}`}
                  dotted
                />
              ) : null}
              {course.note ? (
                <p className={`${BODY_SM} ${MUTED} max-w-56 text-balance`}>
                  {course.note}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
