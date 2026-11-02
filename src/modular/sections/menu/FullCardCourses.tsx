import { list, text } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import { INNER_EYEBROW, H3_ITEM, TONE_TEXT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Dishes } from "./Dishes";

/*
 * The short line under the heading, centred, 112px wide: drawn over the
 * list's top, the courses 32px under it (40px from `@3xl`). Simple's
 * and Full card accent's.
 */
export const SHORT_RULE =
  "bg-[linear-gradient(var(--m-line),var(--m-line))] bg-[length:7rem_1px] bg-top bg-no-repeat";

/**
 * Simple's (`3`) courses as a full card (`FullCard`): the heading
 * centred, Simple's short line under it, then the courses, centred: each
 * course's label (an eyebrow in the accent) over its dishes, one per
 * line, as a card's item heading (`H3_ITEM`). No course notes. Full card
 * (`8`); with `accent`, the card on the accent: Full card accent (`10`).
 */
export function FullCardCourses({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const courses = list(values, "courses");
  if (courses.length === 0) return null;
  const heading =
    text(values, "eyebrow") || text(values, "heading") || text(values, "note");

  return (
    <FullCard values={values} ground={ground} accent={accent}>
      <ul
        className={`flex flex-col gap-8 text-center ${heading ? `${SHORT_RULE} pt-8 @3xl:pt-10` : ""}`}
      >
        {courses.map((course, index) => (
          <li key={index} className="flex flex-col items-center gap-3">
            {course.label ? (
              <span className={`${INNER_EYEBROW} ${TONE_TEXT.accent}`}>
                {course.label}
              </span>
            ) : null}
            {course.title ? (
              <Dishes title={course.title} className={H3_ITEM} />
            ) : null}
          </li>
        ))}
      </ul>
    </FullCard>
  );
}
