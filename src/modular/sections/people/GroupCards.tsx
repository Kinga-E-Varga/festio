import { ItemIcon } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";
import { list } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  CARD,
  COLUMN,
  GROUND,
  H3_ITEM,
  INNER_EYEBROW,
  PAD,
  SECTION_GROUND,
  STACK,
  CARD_GRID,
  cardColumns,
  CARD_CENTRED,
  turnTone,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";
import { Names } from "./Names";

/**
 * As Transportation's Cards: a card per group on the other surface, side
 * by side, its icon, when it has one, on a soft disc over its label, every disc in the secondary, then its names. Cards
 * (Cards hard `2`, its `card` `surface-alt`; Cards soft `12`, `surface`; bare: the page's pattern round
 * the cards); with `accent`, the cards on the accent, every disc in the
 * palette's secondary (`ItemIcon`'s `accent`): Cards accent (`8`), bare too. Both bare, so
 * the heading is a sticker (`SectionHeading`'s `sticker`).
 */
export function GroupCards({
  values,
  ground,
  accent = false,
  card = otherGround(ground),
}: VariantProps & {
  accent?: boolean;
  /** The cards' ground when not on the accent: the other surface from `ground` unless given. */
  card?: SectionGround;
}) {
  const groups = list(values, "groups").slice(0, 4);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} sticker />
      {groups.length > 0 ? (
        <ul className={`${CARD_GRID} ${cardColumns(groups.length)}`}>
          {groups.map((group, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${CARD_CENTRED} ${COLUMN} ${GROUND[accent ? "accent" : card]}`}
            >
              <ItemIcon
                mark={itemMark(mode, group.icon, index)}
                tone={turnTone(index, "secondary")}
                accent={accent}
                className="mb-5"
              />
              {group.label ? (
                <span
                  className={`${INNER_EYEBROW} mb-4 text-[color:var(--m-secondary)]`}
                >
                  {group.label}
                </span>
              ) : null}
              <Names names={group.names} className={H3_ITEM} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
