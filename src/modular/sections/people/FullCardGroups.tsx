import { ItemIcon } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";
import { list } from "@/modular/content";
import { FULL_CARD_CELL, FullCard, fullCardGrid } from "@/modular/FullCard";
import { H3_ITEM, INNER_EYEBROW } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Names } from "./Names";

/**
 * The groups as a full card (`FullCard`), as Contact's Full card:
 * the heading centred, the groups under it, side by side, no lines
 * (`fullCardGrid`). Each group
 * centred, as a Cards (`2`) card's content: its icon, when it has one, on a
 * soft disc over its label, every disc in the secondary, then
 * its names. Full card
 * (`7`); with `accent`, the card on the accent, every disc in
 * the palette's secondary (`ItemIcon`'s `accent`): Full card accent (`10`).
 */
export function FullCardGroups({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const groups = list(values, "groups").slice(0, 4);
  const mode = iconMode(values);
  if (groups.length === 0) return null;

  return (
    <FullCard values={values} ground={ground} accent={accent}>
      <ul className={fullCardGrid(groups.length)}>
        {groups.map((group, index) => (
          <li key={index} className={FULL_CARD_CELL}>
            <ItemIcon
              mark={itemMark(mode, group.icon, index)}
              accent={accent}
              className="mb-5"
            />
            {group.label ? (
              <span
                className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}
              >
                {group.label}
              </span>
            ) : null}
            <Names
              names={group.names}
              className={`${H3_ITEM} ${group.label ? "mt-4" : ""}`}
            />
          </li>
        ))}
      </ul>
    </FullCard>
  );
}
