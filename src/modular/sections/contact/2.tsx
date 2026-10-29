import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  H3_ITEM,
  INNER_EYEBROW,
  LINED_CELL,
  LINED_GRID,
  PAD,
  SECTION_GROUND,
  STACK,
  columnsFor,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ContactLines } from "./ContactLines";

/**
 * Cards (`1`) without icons, as Transportation's Grid: centred cells
 * between hairlines (`LINED_GRID`) under the heading, each person's role,
 * name, number and email. One column on a phone.
 */
export function Variant({ values, ground }: VariantProps) {
  const people = list(values, "people").slice(0, 4);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {people.length > 0 ? (
        <ul className={`${LINED_GRID} ${columnsFor(people.length)}`}>
          {people.map((person, index) => (
            <li
              key={index}
              className={`${LINED_CELL} ${SECTION_GROUND[ground]} flex flex-col items-center px-6 py-8 text-center @3xl:px-8 @3xl:py-10`}
            >
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
