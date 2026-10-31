import type { ReactNode } from "react";
import { otherGround } from "@/modular/ground";
import {
  CORNER,
  GROUND,
  INNER_EYEBROW,
  PAD,
  SECTION_GROUND,
  COLUMN,
} from "@/modular/styles";
import type { ListItem, SectionGround } from "@/types/modular";
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
 * A heading beside one card, like the menu on the table, for Icon & card
 * and Two-line & card: on the other surface, with a hairline frame and no
 * shadow. Inside, centred: each course's label, in the secondary, over a
 * short rule, and its dishes, one per line. No course notes; the section's
 * note is under the heading.
 */
export function MenuCard({
  heading,
  courses,
  ground,
}: {
  heading: ReactNode;
  courses: ListItem[];
  ground: SectionGround;
}) {
  return (
    <div className={`${LAYOUT} items-start ${SECTION_GROUND[ground]} ${PAD}`}>
      {heading}
      {courses.length > 0 ? (
        <CourseCard
          courses={courses}
          ground={ground}
          className="@6xl:mx-0 @6xl:max-w-none"
        />
      ) : null}
    </div>
  );
}

/* Accent's outer frame: the page's accent, as the card sits on the surface. */
const ACCENT_LINE = "border-[var(--m-accent)]";

/**
 * The menu card alone, centred, 560px at most: on the other surface,
 * with a hairline frame and no shadow. Inside, centred: each course's
 * label, in the secondary, over a short rule, and its dishes, one per
 * line. Icon & card's and Two-line & card's (`MenuCard`). With `accent`
 * (Accent, `11`, under the heading on the accent band): as wide as the
 * section's content (`COLUMN`), with Framed card's double frame (`3`), its
 * outer hairline in the accent, the inner one the usual line colour.
 */
export function CourseCard({
  courses,
  ground,
  accent = false,
  className = "",
}: {
  courses: ListItem[];
  ground: SectionGround;
  accent?: boolean;
  className?: string;
}) {
  const fill = GROUND[otherGround(ground)];
  const card = (
    <div
      className={`${accent ? "" : `mx-auto w-full max-w-140 ${fill}`} flex flex-col items-center gap-4 ${CORNER} border-1 border-[var(--m-line)] px-6 py-10 text-center @3xl:px-14 @3xl:py-12 ${className}`}
    >
      <ul className="flex flex-col gap-8">
        {courses.map((course, index) => (
          <li key={index} className="flex flex-col items-center gap-1.5">
            {course.label ? (
              <>
                <span
                  className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}
                >
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
  );
  return accent ? (
    <div
      className={`${COLUMN} p-2.5 ${CORNER} border-1 ${ACCENT_LINE} ${fill}`}
    >
      {card}
    </div>
  ) : (
    card
  );
}
