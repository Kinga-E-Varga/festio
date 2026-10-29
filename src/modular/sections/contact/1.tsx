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
import { ContactLines } from "./ContactLines";

/**
 * As Transportation's Cards: a card per person on the other surface, side
 * by side, their icon, when they have one, on a soft disc over their role,
 * the discs taking turns accent / secondary, then the name, the number and the email (`ContactLines`).
 */
export function Variant({ values, ground }: VariantProps) {
  const people = list(values, "people").slice(0, 4);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {people.length > 0 ? (
        <ul className={`grid gap-3 @3xl:gap-4 ${cardColumns(people.length)}`}>
          {people.map((person, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${centredWhenStacked(people.length)} ${COLUMN} ${GROUND[otherGround(ground)]}`}
            >
              <TurnIcon name={person.icon} index={index} className="mb-5" />
              {person.role ? (
                <span
                  className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}
                >
                  {person.role}
                </span>
              ) : null}
              {person.name ? (
                <h3 className={`${H3_ITEM} mt-4 mb-1`}>{person.name}</h3>
              ) : null}
              <ContactLines person={person} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
