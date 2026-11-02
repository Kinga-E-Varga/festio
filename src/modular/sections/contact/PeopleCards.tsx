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
  cardColumns,
  centredWhenStacked,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ContactLines } from "./ContactLines";

/**
 * As Transportation's Cards: a card per person on the other surface, side
 * by side, their icon, when they have one, on a soft disc over their role,
 * every disc in the secondary, then the name, the number and the email (`ContactLines`). Cards
 * (`1`); with `accent`, the cards on the accent, every disc in the
 * palette's secondary (`ItemIcon`'s `accent`): Cards accent (`8`).
 */
export function PeopleCards({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const people = list(values, "people").slice(0, 4);
  const mode = iconMode(values);

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {people.length > 0 ? (
        <ul className={`grid gap-3 @3xl:gap-4 ${cardColumns(people.length)}`}>
          {people.map((person, index) => (
            <li
              key={index}
              className={`${CARD} flex flex-col ${centredWhenStacked(people.length)} ${COLUMN} ${GROUND[accent ? "accent" : otherGround(ground)]}`}
            >
              <ItemIcon
                mark={itemMark(mode, person.icon, index)}
                accent={accent}
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
