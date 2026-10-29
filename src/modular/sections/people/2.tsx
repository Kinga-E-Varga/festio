import { TurnIcon } from "@/modular/cards/CardIcon";
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
  cardColumns,
  centredWhenStacked,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Names } from "./Names";

/**
 * As Transportation's Cards: a card per group on the other surface, side
 * by side, its icon, when it has one, on a soft disc over its label, the
 * discs taking turns accent / secondary, then its names.
 */
export function Variant({ values, ground }: VariantProps) {
  const groups = list(values, "groups").slice(0, 4);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {groups.length > 0 ? (
        <ul className={`grid gap-3 @3xl:gap-4 ${cardColumns(groups.length)}`}>
          {groups.map((group, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${centredWhenStacked(groups.length)} ${COLUMN} ${GROUND[otherGround(ground)]}`}
            >
              <TurnIcon name={group.icon} index={index} className="mb-5" />
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
