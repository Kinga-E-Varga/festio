import { list } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { IconHeading } from "@/modular/IconHeading";
import { CORNER, GROUND, INNER_EYEBROW, MUTED, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Dishes } from "./Dishes";

/*
 * `SPLIT`'s columns, as wide `SPLIT` makes them from `@5xl`, but beside
 * the heading only from `@6xl`: stacked longer, or the card gets too
 * narrow and its courses wrap badly. The card fills its column.
 */
const LAYOUT =
  "grid gap-8 @6xl:grid-cols-[minmax(0,1fr)_minmax(350px,min(620px,calc(90%_-_410px)))] @6xl:gap-[10%]";

/* The short rule under a course's label. */
const RULE = "my-1 block h-px w-28 bg-[var(--m-line)]";

/**
 * A meal on its soft disc over the heading — no eyebrow — beside one card,
 * like the menu on the table: on the other surface, with a hairline frame
 * and a soft shadow in the palette's own shade. Inside, centred: each course's label over a short rule, and
 * its dishes, one per line. No course notes; the section's note is under
 * the heading.
 */
export function Variant({ values, ground }: VariantProps) {
  const courses = list(values, "courses");

  return (
    <div className={`${LAYOUT} items-start ${GROUND[ground]} ${PAD}`}>
      <IconHeading icon="meal" values={values} align="start-late" />
      {courses.length > 0 ? (
        <div
          className={`mx-auto flex w-full max-w-140 flex-col items-center gap-4 @6xl:mx-0 @6xl:max-w-none ${CORNER} border-1 border-[var(--m-line)] px-6 py-10 text-center shadow-lg shadow-(color:--m-shadow)/30 ${GROUND[otherGround(ground)]} @3xl:px-14 @3xl:py-12`}
        >
          <ul className="flex flex-col gap-8">
            {courses.map((course, index) => (
              <li key={index} className="flex flex-col items-center gap-1.5">
                {course.label ? (
                  <>
                    <span className={`${INNER_EYEBROW} ${MUTED}`}>
                      {course.label}
                    </span>
                    <span className={RULE} />
                  </>
                ) : null}
                {course.title ? <Dishes title={course.title} /> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
