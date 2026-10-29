import { TurnIcon } from "@/modular/cards/CardIcon";
import { list } from "@/modular/content";
import { FULL_CARD_CELL, FullCard, fullCardGrid } from "@/modular/FullCard";
import { H3_ITEM, INNER_EYEBROW } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Names } from "./Names";

/**
 * The groups as a full card (`FullCard`), as Contact's Full card & grid:
 * the heading centred, the groups under it between the card's lines, side
 * by side, hairlines between them (`fullCardGrid`). Each group
 * centred, as a Cards (`2`) card's content: its icon, when it has one, on a
 * soft disc over its label, the discs taking turns accent / secondary, then
 * its names.
 */
export function Variant({ values, ground }: VariantProps) {
  const groups = list(values, "groups").slice(0, 4);
  if (groups.length === 0) return null;

  return (
    <FullCard values={values} ground={ground}>
      <ul className={fullCardGrid(groups.length)}>
        {groups.map((group, index) => (
          <li key={index} className={FULL_CARD_CELL}>
            <TurnIcon name={group.icon} index={index} className="mb-5" />
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
