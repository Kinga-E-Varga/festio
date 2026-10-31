import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  H3_ITEM,
  INNER_EYEBROW,
  LINED_CELL,
  LINED_GRID,
  UNLINED_PULL,
  PAD,
  SECTION_GROUND,
  STACK,
  columnsFor,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ItemIcon } from "@/modular/cards/CardIcon";
import { Names } from "./Names";

/**
 * As Transportation's and Contact's Grid: centred cells between hairlines
 * (`LINED_GRID`) under the heading, each group's label in the secondary
 * over its names. One column on a phone. On the accent
 * (Accent, `9`) no hairlines, and each icon, when there is one, on
 * the palette's secondary disc over the eyebrow (`ItemIcon`'s `accent`).
 */
export function Variant({ values, ground }: VariantProps) {
  const groups = list(values, "groups").slice(0, 4);
  const lined = ground !== "accent";

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {groups.length > 0 ? (
        <ul
          className={`${lined ? LINED_GRID : `grid ${UNLINED_PULL}`} ${columnsFor(groups.length)}`}
        >
          {groups.map((group, index) => (
            <li
              key={index}
              className={`${lined ? LINED_CELL : ""} ${SECTION_GROUND[ground]} flex flex-col items-center px-6 py-8 text-center @3xl:px-8 @3xl:py-10`}
            >
              {lined ? null : (
                <ItemIcon name={group.icon} accent className="mb-5" />
              )}
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
