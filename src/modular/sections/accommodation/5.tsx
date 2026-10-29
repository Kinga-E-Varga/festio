import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  LINED_CELL,
  LINED_GRID,
  PAD,
  STACK,
  columnsFor,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StayCell } from "./StayList";

/* A cell's contents, centred down it. */
const CELL =
  "flex h-full flex-col items-center px-6 py-8 text-center @3xl:px-8 @3xl:py-10";

/**
 * Transportation's Cards (`1`) for the stays, without icons, the cards
 * cells between hairlines (`LINED_GRID`): up to six side by side (rows of
 * three past four), under the heading centred; each its eyebrow, name and
 * note. A stay with a safe web address is a link, the whole cell, with the
 * arrow after its name. One column on a phone.
 */
export function Variant({ values, ground }: VariantProps) {
  const places = list(values, "places").slice(0, 6);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {places.length > 0 ? (
        <ol className={`${LINED_GRID} ${columnsFor(places.length)}`}>
          {places.map((place, index) => (
            <li
              key={index}
              className={`${LINED_CELL} ${SECTION_GROUND[ground]}`}
            >
              <StayCell place={place} className={CELL} />
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
