import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY,
  H3_ITEM,
  INNER_EYEBROW,
  LINED_CELL,
  LINED_GRID,
  MUTED,
  PAD,
  STACK,
  columnsFor,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Cards (`1`) without icons, the cards cells between hairlines
 * (`LINED_GRID`), as Accommodation's Grid (`5`): up to six side by side
 * (rows of three past four), under the heading centred; each way centred
 * down its cell, its eyebrow, title and note. One column on a phone.
 */
export function Variant({ values, ground }: VariantProps) {
  const ways = list(values, "ways").slice(0, 6);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {ways.length > 0 ? (
        <ul className={`${LINED_GRID} ${columnsFor(ways.length)}`}>
          {ways.map((way, index) => (
            <li
              key={index}
              className={`${LINED_CELL} ${SECTION_GROUND[ground]} flex flex-col items-center px-6 py-8 text-center @3xl:px-8 @3xl:py-10`}
            >
              {way.label ? (
                <span
                  className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}
                >
                  {way.label}
                </span>
              ) : null}
              {way.title ? (
                <h3 className={`${H3_ITEM} ${way.label ? "mt-4" : ""} mb-1`}>
                  {way.title}
                </h3>
              ) : null}
              {way.text ? (
                <p className={`${BODY} ${MUTED} whitespace-pre-line`}>
                  {way.text}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
