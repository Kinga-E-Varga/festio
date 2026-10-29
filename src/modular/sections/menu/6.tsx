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
import { TurnIcon } from "@/modular/cards/CardIcon";

/**
 * Transportation's Cards (`1`) for the courses: one card per course on the
 * other surface, up to six side by side (rows of three past four), under
 * the heading centred; its icon, when it has one, on a soft disc over its
 * label, the discs taking turns — the 1st, 3rd… in the accent, the 2nd,
 * 4th… in the secondary — then its dishes one under another and its note.
 */
export function Variant({ values, ground }: VariantProps) {
  const courses = list(values, "courses").slice(0, 6);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {courses.length > 0 ? (
        <ul className={`grid gap-3 @3xl:gap-4 ${cardColumns(courses.length)}`}>
          {courses.map((course, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${centredWhenStacked(courses.length)} ${COLUMN} ${GROUND[otherGround(ground)]}`}
            >
              <TurnIcon name={course.icon} index={index} className="mb-5" />
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
