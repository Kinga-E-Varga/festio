import { list } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import { INNER_EYEBROW, H3_ITEM, TONE_TEXT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Dishes } from "./Dishes";

/**
 * Framed card's (`3`) courses as a full card (`FullCard`): the heading
 * centred, the courses under it between the card's lines, centred: each
 * course's label (an eyebrow in the accent) over its dishes, one per
 * line, as a card's item heading (`H3_ITEM`). No course notes.
 */
export function Variant({ values, ground }: VariantProps) {
  const courses = list(values, "courses");
  if (courses.length === 0) return null;

  return (
    <FullCard values={values} ground={ground}>
      <ul className="flex flex-col gap-8 py-8 text-center @3xl:py-10">
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
