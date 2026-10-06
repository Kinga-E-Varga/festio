import { pad } from "@/lib/event";
import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  CAPS,
  GROUND,
  H3,
  HEADING,
  MUTED,
  PAD,
  STACK,
  columnsFor,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Up to four courses side by side, numbered, with hairlines between them.
 * One dish per course: a title of several lines shows its first only.
 * Each cell draws its own top line and a shorter left one that stops short
 * of the lines above and below, and is pulled 1px up and left, so the lines
 * follow whatever way the cells wrap; the list clips the ones along its
 * outer edge. Real lines, not 1px gaps: a gap at a fractional position can
 * round away to nothing. One column on a phone.
 */
export function Variant({ values, ground }: VariantProps) {
  const courses = list(values, "courses").slice(0, 4);

  return (
    <div className={`${STACK} ${GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {courses.length > 0 ? (
        <ol
          className={`grid overflow-hidden border-y-1 border-[var(--m-line)] ${columnsFor(courses.length)}`}
        >
          {courses.map((course, index) => (
            <li
              key={index}
              className={`relative -mt-px -ml-px flex flex-col items-center justify-center border-t-1 border-[var(--m-line)] ${GROUND[ground]} before:absolute before:inset-y-6 before:left-0 before:w-px before:bg-[var(--m-line)] px-5 py-8 text-center @3xl:py-10`}
            >
              <span
                className={`${HEADING} text-[18px] leading-[1.4] italic text-[color:var(--m-secondary)] @3xl:text-[20px]`}
              >
                {pad(index + 1)}
              </span>
              {course.label ? (
                <span
                  className={`${CAPS} mt-3 font-medium text-[color:var(--m-accent)]`}
                >
                  {course.label}
                </span>
              ) : null}
              {course.title ? (
                <h3 className={`${H3} mt-2 mb-1.5`}>
                  {course.title.split("\n")[0]}
                </h3>
              ) : null}
              {course.note ? (
                <p className={`${BODY_SM} ${MUTED} max-w-56 text-balance`}>
                  {course.note}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
