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
  CARD_CENTRED,
  CARD_GRID,
  cardColumns,
  SECTION_GROUND,
  turnTone,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";
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
 * Cards hard (`6`, its `card` `surface-alt`), Cards soft (`13`,
 * `surface`), Cards accent (`9`): all bare, the page's pattern round
 * the cards, so the heading is a sticker (`SectionHeading`'s `sticker`).
 */
export function CourseCards({
  values,
  ground,
  accent = false,
  card = otherGround(ground),
}: VariantProps & {
  accent?: boolean;
  /** The cards' ground when not on the accent: the other surface from `ground` unless given. */
  card?: SectionGround;
}) {
  const courses = list(values, "courses").slice(0, 6);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} sticker />
      {courses.length > 0 ? (
        <ul className={`${CARD_GRID} ${cardColumns(courses.length)}`}>
          {courses.map((course, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${CARD_CENTRED} ${COLUMN} ${GROUND[accent ? "accent" : card]}`}
            >
              <ItemIcon
                mark={itemMark(mode, course.icon, index)}
                tone={turnTone(index, "secondary")}
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
