import { pad } from "@/lib/event";
import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  CAPS,
  GROUND,
  H3,
  LEAD,
  MUTED,
  PAD,
  SERIF,
  STACK,
  columnsFor,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Up to four courses side by side, numbered, with hairlines between them.
 * Each cell draws its own top and left line and is pulled 1px up and left,
 * so the lines follow whatever way the cells wrap; the list clips the ones
 * along its outer edge. Real borders, not 1px gaps: a gap at a fractional
 * position can round away to nothing. One column on a phone.
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
              className={`-mt-px -ml-px flex flex-col items-center justify-center border-t-1 border-l-1 border-[var(--m-line)] ${GROUND[ground]} px-5 py-8 text-center @3xl:py-10`}
            >
              <span
                className={`${SERIF} ${LEAD} italic text-[color:var(--m-secondary)]`}
              >
                {pad(index + 1)}
              </span>
              {course.label ? (
                <span className={`${CAPS} mt-3 text-[color:var(--m-accent)]`}>
                  {course.label}
                </span>
              ) : null}
              {course.title ? (
                <h3 className={`${H3} mt-2 mb-1.5`}>{course.title}</h3>
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
