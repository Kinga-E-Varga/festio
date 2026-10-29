import { list, text } from "@/modular/content";
import { FULL_CARD_PAD, FULL_CARD_WIDTH } from "@/modular/FullCard";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  CORNER,
  INNER_EYEBROW,
  GROUND,
  H3_ITEM,
  PAD,
  STACK,
  TONE_TEXT,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Dishes } from "./Dishes";

/*
 * The short line under the heading, centred, 112px wide: drawn over the
 * list's top, the courses 32px under it (40px from `@3xl`).
 */
const RULE =
  "bg-[linear-gradient(var(--m-line),var(--m-line))] bg-[length:7rem_1px] bg-top bg-no-repeat";

/* Each frame: a hairline in the line, with the corners step. */
const FRAME = `${CORNER} border-1 border-[var(--m-line)]`;

/**
 * One card down the middle, as wide as a full card (`FULL_CARD_WIDTH`),
 * like the menu on the table, and nothing outside it: on the other
 * surface, with a double frame — a hairline, a gap of the card's own
 * surface, a second hairline — and no shadow. Inside, centred: the heading
 * on top, its eyebrow over it and the section's note under it, a short
 * line (only under a heading), then each course's label (an eyebrow in
 * the accent) over its dishes, one per line, as a
 * card's item heading (`H3_ITEM`). No course notes. Padded and spaced as
 * the full cards (`FULL_CARD_PAD`, Menu's Full card `8`).
 */
export function Variant({ values, ground }: VariantProps) {
  const courses = list(values, "courses");
  const heading =
    text(values, "eyebrow") || text(values, "heading") || text(values, "note");

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <div
        className={`${FULL_CARD_WIDTH} p-2.5 ${FRAME} ${GROUND[otherGround(ground)]}`}
      >
        <div className={`${STACK} text-center ${FRAME} ${FULL_CARD_PAD}`}>
          <SectionHeading values={values} />
          {courses.length > 0 ? (
            <ul
              className={`flex flex-col gap-8 ${heading ? `${RULE} pt-8 @3xl:pt-10` : ""}`}
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
        </div>
      </div>
    </div>
  );
}
