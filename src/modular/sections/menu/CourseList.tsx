import { pad } from "@/lib/event";
import {
  BODY_SM,
  H3_ITEM,
  INNER_EYEBROW,
  MUTED,
  TIME_COLUMN,
  TONE_TEXT,
  turnTone,
} from "@/modular/styles";
import type { ListItem } from "@/types/modular";
import { Dishes, dishesOf } from "./Dishes";
import { TurnIcon } from "@/modular/cards/CardIcon";

/**
 * The courses as a list for Two-line & list and Icon & list: a hairline
 * above and below and between the courses; each its label, its dishes one
 * under another and its note, with more room over the note under several
 * dishes; spaced as Transportation's lists: 16px over the label, or 28px
 * over the dishes without one, 16px from the label to the dishes and 24px
 * under. Its icon, when it has one, on a soft disc at the row's end,
 * centred on the course, the discs taking turns — the 1st, 3rd… in the
 * accent, the 2nd, 4th… in the secondary — as Transportation's Two-line &
 * list. `numbered`: no icons; each course's number (01, 02…) beside it, taking
 * turns accent / secondary, in a column as wide as the schedule's times
 * (`TIME_COLUMN`), centred on the course, as Transportation's Icon & list,
 * and on a phone the list 350px at most, centred.
 */
export function CourseList({
  courses,
  numbered = false,
}: {
  courses: ListItem[];
  numbered?: boolean;
}) {
  if (courses.length === 0) return null;
  return (
    <ul
      className={`border-y-1 border-[var(--m-line)] ${numbered ? "mx-auto w-full max-w-[350px] @3xl:mx-0 @3xl:max-w-none" : ""}`}
    >
      {courses.map((course, index) => (
        <li
          key={index}
          className={`border-[var(--m-line)] pt-4 pb-6 not-last:border-b-1 grid items-center ${numbered ? "grid-cols-[auto_minmax(0,1fr)] gap-x-3" : "grid-cols-[minmax(0,1fr)_2.375rem] gap-x-6"}`}
        >
          {numbered ? (
            <span className={`${TIME_COLUMN} ${TONE_TEXT[turnTone(index)]}`}>
              {pad(index + 1)}
            </span>
          ) : null}
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
          {!numbered && <TurnIcon name={course.icon} index={index} />}
        </li>
      ))}
    </ul>
  );
}
