import { list, text } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { INNER_EYEBROW, H3_ITEM, TONE_TEXT } from "@/modular/styles";
import type { SectionValues } from "@/types/modular";
import { Dishes } from "./Dishes";
import { SHORT_RULE } from "./FullCardCourses";

/**
 * The menu centred: the heading on top, its eyebrow over it and the
 * section's note under it, a short line (only under a heading), then each
 * course's label (an eyebrow in the accent) over its dishes, one per line,
 * as a card's item heading (`H3_ITEM`). No course notes. Simple's (`3`)
 * and Simple accent's (`11`).
 */
export function CenteredCourses({ values }: { values: SectionValues }) {
  const courses = list(values, "courses");
  const heading =
    text(values, "eyebrow") || text(values, "heading") || text(values, "note");

  return (
    <>
      <SectionHeading values={values} />
      {courses.length > 0 ? (
        <ul
          className={`flex flex-col gap-8 ${heading ? `${SHORT_RULE} pt-8 @3xl:pt-10` : ""}`}
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
      ) : null}
    </>
  );
}
