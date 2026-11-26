import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY,
  CARD,
  COLUMN,
  INNER_EYEBROW,
  GROUND,
  H3_ITEM,
  MUTED,
  PAD,
  STACK,
  CARD_CENTRED,
  CARD_GRID,
  cardColumns,
  SECTION_GROUND,
  turnTone,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";
import { otherGround } from "@/modular/ground";
import { ItemIcon } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";

/**
 * One card per way of arriving: its icon, when it has one, on a soft disc
 * over its eyebrow, every disc in the secondary — then its title and note. Cards (`1`);
 * with `accent`, the cards on the accent, every disc in the palette's
 * secondary (`ItemIcon`'s `accent`): Cards accent (`9`).
 * Cards hard (`1`, its `card` `surface-alt`), Cards soft (`13`,
 * `surface`), Cards accent (`9`): all bare, the page's pattern round
 * the cards, so the heading is a sticker (`SectionHeading`'s `sticker`).
 */
export function WayCards({
  values,
  ground,
  accent = false,
  card = otherGround(ground),
}: VariantProps & {
  accent?: boolean;
  /** The cards' ground when not on the accent: the other surface from `ground` unless given. */
  card?: SectionGround;
}) {
  const ways = list(values, "ways").slice(0, 6);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} sticker />
      {ways.length > 0 ? (
        <ul className={`${CARD_GRID} ${cardColumns(ways.length)}`}>
          {ways.map((way, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${CARD_CENTRED} ${COLUMN} ${GROUND[accent ? "accent" : card]}`}
            >
              <ItemIcon
                mark={itemMark(mode, way.icon, index)}
                tone={turnTone(index, "secondary")}
                accent={accent}
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
                <h3 className={`${H3_ITEM} mt-4 mb-1`}>{way.title}</h3>
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
