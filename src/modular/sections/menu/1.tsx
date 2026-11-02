import { ItemIcon } from "@/modular/cards/CardIcon";
import { list } from "@/modular/content";
import { iconMode, itemMark } from "@/modular/item-marks";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  H3_ITEM,
  INNER_EYEBROW,
  MUTED,
  PAD,
  STACK,
  UNLINED_PULL,
  columnsFor,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Dishes, dishesOf } from "./Dishes";

/**
 * Up to six courses side by side (rows of three past four), no lines, as
 * the other sections' Grids, each course's mark (`itemMark`: its icon or
 * its number) on the secondary disc, 20px over its label, then the
 * dishes one under another, a dot between them, more
 * room under several. One column on a phone.
 */
export function Variant({ values, ground }: VariantProps) {
  const courses = list(values, "courses").slice(0, 6);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {courses.length > 0 ? (
        <ol className={`grid ${UNLINED_PULL} ${columnsFor(courses.length)}`}>
          {courses.map((course, index) => (
            <li
              key={index}
              className={`flex flex-col items-center justify-start ${SECTION_GROUND[ground]} px-5 py-8 text-center @3xl:py-10`}
            >
              <ItemIcon
                mark={itemMark(mode, course.icon, index)}
                className="mb-5"
              />
              {course.label ? (
                <span
                  className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}
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
