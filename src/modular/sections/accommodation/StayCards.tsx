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
import { ItemIcon } from "@/modular/cards/CardIcon";

/* A card's contents, down its left side. */
const CELL = "flex h-full flex-col";

/**
 * Transportation's Cards (`1`) for the stays: one card per stay on the
 * other surface, up to six side by side (rows of three past four), under
 * the heading centred; its icon, when it has one, on a soft disc over its
 * eyebrow, every disc in the secondary — then its name and note. A stay with a safe web
 * address is a link, the whole card, with the arrow after its name.
 * Cards (`6`); with `accent`, the cards on the accent, every disc in the
 * palette's secondary (`ItemIcon`'s `accent`): Cards accent (`8`).
 */
export function StayCards({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const places = list(values, "places").slice(0, 6);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {places.length > 0 ? (
        <ol className={`grid gap-3 @3xl:gap-4 ${cardColumns(places.length)}`}>
          {places.map((place, index) => (
            <li
              key={index}
              className={`${CARD} ${COLUMN} ${GROUND[accent ? "accent" : otherGround(ground)]}`}
            >
              <StayCell
                place={place}
                className={`${CELL} ${centredWhenStacked(places.length)}`}
              >
                <ItemIcon name={place.icon} accent={accent} className="mb-5" />
              </StayCell>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
