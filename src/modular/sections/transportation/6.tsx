import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY,
  H3_ITEM,
  INNER_EYEBROW,
  UNLINED_PULL,
  MUTED,
  PAD,
  STACK,
  columnsFor,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ItemIcon } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";

/**
 * Cards (`1`) as a grid, as Accommodation's Grid (`5`): up to six
 * side by side (rows of three past four), under the heading centred, no
 * lines; each way centred down its cell, its icon, when it has one, on the
 * secondary disc over its eyebrow, then its title and note. One column on
 * a phone. On the accent (Grid accent, `11`) the discs in the palette's own
 * secondary (`ItemIcon`'s `accent`).
 */
export function Variant({ values, ground }: VariantProps) {
  const ways = list(values, "ways").slice(0, 6);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {ways.length > 0 ? (
        <ul className={`grid ${UNLINED_PULL} ${columnsFor(ways.length)}`}>
          {ways.map((way, index) => (
            <li
              key={index}
              className={`${SECTION_GROUND[ground]} flex flex-col items-center px-6 py-8 text-center @3xl:px-8 @3xl:py-10`}
            >
              <ItemIcon
                mark={itemMark(mode, way.icon, index)}
                accent={ground === "accent"}
                className="mb-5"
              />
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
