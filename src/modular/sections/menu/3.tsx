import { list, text } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  CORNER,
  EYEBROW,
  GROUND,
  LEAD,
  MUTED,
  PAD,
  TONE_TEXT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Dishes } from "./Dishes";

/*
 * The short rule under the heading and after the last course, 24px from
 * what is on either side instead of the column's 40px.
 */
const RULE = "-my-4 block h-px w-28 bg-[var(--m-line)]";

/* Each frame: a hairline in the line, with the corners step. */
const FRAME = `${CORNER} border-1 border-[var(--m-line)]`;

/**
 * One card down the middle, like the menu on the table, and nothing outside
 * it: on the other surface, with a double frame — a hairline, a gap of the
 * card's own surface, a second hairline — and a soft shadow in the palette's
 * own shade. Inside, centred: the heading on top — no eyebrow — a short
 * rule, each course's label (an eyebrow in the secondary) over its dishes,
 * one per line, another rule and the section's note last. No course notes.
 */
export function Variant({ values, ground }: VariantProps) {
  const courses = list(values, "courses");
  const note = text(values, "note");

  return (
    <div className={`${GROUND[ground]} ${PAD}`}>
      <div
        className={`mx-auto w-full max-w-140 p-2.5 shadow-lg shadow-(color:--m-shadow)/30 ${FRAME} ${GROUND[otherGround(ground)]}`}
      >
        <div
          className={`flex flex-col items-center gap-10 px-6 py-10 text-center ${FRAME} @3xl:px-14 @3xl:py-12`}
        >
          <SectionHeading values={{ ...values, eyebrow: "", note: "" }} />
          <span className={RULE} />
          {courses.length > 0 ? (
            <ul className="flex flex-col gap-8">
              {courses.map((course, index) => (
                <li key={index} className="flex flex-col items-center gap-3">
                  {course.label ? (
                    <span className={`${EYEBROW} ${TONE_TEXT.secondary}`}>
                      {course.label}
                    </span>
                  ) : null}
                  {course.title ? <Dishes title={course.title} /> : null}
                </li>
              ))}
            </ul>
          ) : null}
          <span className={RULE} />
          {note ? (
            <p className={`${LEAD} ${MUTED} whitespace-pre-line text-balance`}>
              {note}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
