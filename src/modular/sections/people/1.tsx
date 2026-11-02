import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  H3_ITEM,
  INNER_EYEBROW,
  UNLINED_PULL,
  PAD,
  SECTION_GROUND,
  STACK,
  columnsFor,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ItemIcon } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";
import { Names } from "./Names";

/**
 * As Transportation's and Contact's Grid: centred cells side by
 * side under the heading, no lines, each group's icon, when it has one, on
 * the secondary disc over its label in the secondary, then its names. One
 * column on a phone. On the accent (Grid accent, `9`) the discs in the
 * palette's own secondary (`ItemIcon`'s `accent`).
 */
export function Variant({ values, ground }: VariantProps) {
  const groups = list(values, "groups").slice(0, 4);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {groups.length > 0 ? (
        <ul className={`grid ${UNLINED_PULL} ${columnsFor(groups.length)}`}>
          {groups.map((group, index) => (
            <li
              key={index}
              className={`${SECTION_GROUND[ground]} flex flex-col items-center px-6 py-8 text-center @3xl:px-8 @3xl:py-10`}
            >
              <ItemIcon
                mark={itemMark(mode, group.icon, index)}
                accent={ground === "accent"}
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
      ) : null}
    </div>
  );
}
