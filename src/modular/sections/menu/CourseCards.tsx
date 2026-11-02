import { list } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  CARD,
  COLUMN,
  GROUND,
  H3_ITEM,
  INNER_EYEBROW,
  MUTED,
  PAD,
  STACK,
  centredWhenStacked,
  cardColumns,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Dishes, dishesOf } from "./Dishes";
import { ItemIcon } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";

/**
 * Transportation's Cards (`1`) for the courses: one card per course on the
 * other surface, up to six side by side (rows of three past four), under
 * the heading centred; its icon, when it has one, on a soft disc over its
 * label, every disc in the secondary — then its dishes one under another and its note.
 * Cards (`6`); with `accent`, the cards on the accent, every disc in the
 * palette's secondary (`ItemIcon`'s `accent`): Cards accent (`9`).
 */
export function CourseCards({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const courses = list(values, "courses").slice(0, 6);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {courses.length > 0 ? (
        <ul className={`grid gap-3 @3xl:gap-4 ${cardColumns(courses.length)}`}>
          {courses.map((course, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${centredWhenStacked(courses.length)} ${COLUMN} ${GROUND[accent ? "accent" : otherGround(ground)]}`}
            >
              <ItemIcon
                mark={itemMark(mode, course.icon, index)}
                accent={accent}
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
                  className={`${H3_ITEM} ${course.label ? "mt-4" : ""}`}
                />
              ) : null}
              {course.note ? (
                <p
                  className={`${BODY_SM} ${MUTED} ${dishesOf(course.title ?? "").length > 1 ? "mt-3" : "mt-1"}`}
                >
                  {course.note}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
