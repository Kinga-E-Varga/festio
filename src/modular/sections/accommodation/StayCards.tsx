import { list } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  CARD,
  COLUMN,
  GROUND,
  PAD,
  STACK,
  CARD_CENTRED,
  CARD_GRID,
  cardColumns,
  SECTION_GROUND,
  turnTone,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";
import { StayCell } from "./StayList";
import { ItemIcon } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";

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
 * Cards hard (`6`, its `card` `surface-alt`), Cards soft (`12`,
 * `surface`), Cards accent (`8`): all bare, the page's pattern round
 * the cards, so the heading is a sticker (`SectionHeading`'s `sticker`).
 */
export function StayCards({
  values,
  ground,
  accent = false,
  card = otherGround(ground),
}: VariantProps & {
  accent?: boolean;
  /** The cards' ground when not on the accent: the other surface from `ground` unless given. */
  card?: SectionGround;
}) {
  const places = list(values, "places").slice(0, 6);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} sticker />
      {places.length > 0 ? (
        <ol className={`${CARD_GRID} ${cardColumns(places.length)}`}>
          {places.map((place, index) => (
            <li
              key={index}
              className={`${CARD} ${COLUMN} ${GROUND[accent ? "accent" : card]}`}
            >
              <StayCell place={place} className={`${CELL} ${CARD_CENTRED}`}>
                <ItemIcon
                  mark={itemMark(mode, place.icon, index)}
                  tone={turnTone(index, "secondary")}
                  accent={accent}
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
