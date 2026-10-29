import { list } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  CARD,
  COLUMN,
  GROUND,
  PAD,
  STACK,
  centredWhenStacked,
  cardColumns,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StayCell } from "./StayList";
import { TurnIcon } from "@/modular/cards/CardIcon";

/* A card's contents, down its left side. */
const CELL = "flex h-full flex-col";

/**
 * Transportation's Cards (`1`) for the stays: one card per stay on the
 * other surface, up to six side by side (rows of three past four), under
 * the heading centred; its icon, when it has one, on a soft disc over its
 * eyebrow, the discs taking turns — the 1st, 3rd… in the accent, the 2nd,
 * 4th… in the secondary — then its name and note. A stay with a safe web
 * address is a link, the whole card, with the arrow after its name.
 */
export function Variant({ values, ground }: VariantProps) {
  const places = list(values, "places").slice(0, 6);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {places.length > 0 ? (
        <ol className={`grid gap-3 @3xl:gap-4 ${cardColumns(places.length)}`}>
          {places.map((place, index) => (
            <li
              key={index}
              className={`${CARD} ${COLUMN} ${GROUND[otherGround(ground)]}`}
            >
              <StayCell
                place={place}
                className={`${CELL} ${centredWhenStacked(places.length)}`}
              >
                <TurnIcon name={place.icon} index={index} className="mb-5" />
              </StayCell>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
