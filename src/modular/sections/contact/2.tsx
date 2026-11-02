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
import { ContactLines } from "./ContactLines";

/**
 * Cards (`1`) as a grid, as Transportation's Grid: centred cells
 * side by side under the heading, no lines, each person's icon, when they
 * have one, on the secondary disc over their role, then their name, number
 * and email. One column on a phone. On the accent (Grid accent, `9`) the discs
 * in the palette's own secondary (`ItemIcon`'s `accent`).
 */
export function Variant({ values, ground }: VariantProps) {
  const people = list(values, "people").slice(0, 4);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {people.length > 0 ? (
        <ul className={`grid ${UNLINED_PULL} ${columnsFor(people.length)}`}>
          {people.map((person, index) => (
            <li
              key={index}
              className={`${SECTION_GROUND[ground]} flex flex-col items-center px-6 py-8 text-center @3xl:px-8 @3xl:py-10`}
            >
              <ItemIcon
                mark={itemMark(mode, person.icon, index)}
                accent={ground === "accent"}
                className="mb-5"
              />
              {person.role ? (
                <span
                  className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}
                >
                  {person.role}
                </span>
              ) : null}
              {person.name ? (
                <h3 className={`${H3_ITEM} ${person.role ? "mt-4" : ""} mb-1`}>
                  {person.name}
                </h3>
              ) : null}
              <ContactLines person={person} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
