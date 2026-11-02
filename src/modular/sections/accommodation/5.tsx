import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  UNLINED_PULL,
  PAD,
  STACK,
  columnsFor,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StayCell } from "./StayList";
import { ItemIcon } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";

/* A cell's contents, centred down it. */
const CELL =
  "flex h-full flex-col items-center px-6 py-8 text-center @3xl:px-8 @3xl:py-10";

/**
 * Transportation's Cards (`1`) for the stays, as a grid: up to six side by
 * side (rows of three past four), under the heading centred, no lines; each
 * its icon, when it has one, on the secondary disc over its eyebrow, then
 * its name and note. A stay with a safe web address is a link, the whole
 * cell, with the arrow after its name. One column on a phone. On the accent
 * (Grid accent, `9`) the discs in the palette's own secondary (`ItemIcon`'s
 * `accent`).
 */
export function Variant({ values, ground }: VariantProps) {
  const places = list(values, "places").slice(0, 6);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {places.length > 0 ? (
        <ol className={`grid ${UNLINED_PULL} ${columnsFor(places.length)}`}>
          {places.map((place, index) => (
            <li key={index} className={`${SECTION_GROUND[ground]}`}>
              <StayCell place={place} className={CELL}>
                <ItemIcon
                  mark={itemMark(mode, place.icon, index)}
                  accent={ground === "accent"}
                  className="mb-5"
                />
              </StayCell>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
