import {
  BODY_SM,
  H3_ITEM,
  INNER_EYEBROW,
  MUTED,
  DISC_ROW,
  leadRow,
  NARROW_LIST,
} from "@/modular/styles";
import type { ListItem } from "@/types/modular";
import { Dishes, dishesOf } from "./Dishes";
import { ItemIcon, LeadMark } from "@/modular/cards/CardIcon";
import { itemMark, type IconMode } from "@/modular/item-marks";

/**
 * The courses as a list for Two-line & list and Icon & list: a hairline
 * above and below and between the courses; each its label, its dishes one
 * under another and its note, with more room over the note under several
 * dishes; spaced as Transportation's lists: 16px over the label, or 28px
 * over the dishes without one, 16px from the label to the dishes and 24px
 * under. Its mark (`itemMark`), when it has one, on a soft disc at the row's end,
 * centred on the course, every disc in the secondary — as Transportation's Two-line &
 * list. `numbered`: each course's mark (`LeadMark`: its icon, or its number 01, 02…) bare before it, in the accent, in a column as wide as the schedule's times
 * (`TIME_COLUMN`), centred on the course, as Transportation's Icon & list,
 * and on a phone the list 350px at most, centred.
 */
export function CourseList({
  courses,
  mode,
  numbered = false,
}: {
  courses: ListItem[];
  /** The section's `iconMode`: each course's mark at the row's end, by the switches. */
  mode: IconMode;
  numbered?: boolean;
}) {
  if (courses.length === 0) return null;
  const marks = courses.map((course, index) =>
    itemMark(mode, course.icon, index),
  );
  return (
    <ul
      className={`border-y-1 border-[var(--m-line)] ${numbered ? NARROW_LIST : ""}`}
    >
      {courses.map((course, index) => (
        <li
          key={index}
          className={`border-[var(--m-line)] pt-4 pb-6 not-last:border-b-1 ${numbered ? leadRow(marks[index]) : `${DISC_ROW} items-center`}`}
        >
          {numbered ? <LeadMark mark={marks[index]} /> : null}
          <div className={`min-w-0 ${course.label ? "" : "pt-3"}`}>
            {course.label ? (
              <p
                className={`${INNER_EYEBROW} mb-4 text-[color:var(--m-secondary)]`}
              >
                {course.label}
              </p>
            ) : null}
            {course.title ? (
              <Dishes title={course.title} className={H3_ITEM} />
            ) : null}
            {course.note ? (
              <p
                className={`${BODY_SM} ${MUTED} ${dishesOf(course.title ?? "").length > 1 ? "mt-3" : "mt-1"}`}
              >
                {course.note}
              </p>
            ) : null}
          </div>
          {!numbered && <ItemIcon mark={marks[index]} />}
        </li>
      ))}
    </ul>
  );
}
