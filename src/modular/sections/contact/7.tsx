import { TurnIcon } from "@/modular/cards/CardIcon";
import { list } from "@/modular/content";
import { FULL_CARD_CELL, FullCard, fullCardGrid } from "@/modular/FullCard";
import { H3_ITEM, INNER_EYEBROW } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ContactLines } from "./ContactLines";

/**
 * The people as a full card (`FullCard`): the heading centred, the people
 * under it between the card's lines, side by side, hairlines between them
 * (`fullCardGrid`), the card's own lines above and below. Each person
 * centred, as a Cards (`1`) card's content: their icon, when they have one,
 * on a soft disc over their role, the discs taking turns accent /
 * secondary, then their name, number and email.
 */
export function Variant({ values, ground }: VariantProps) {
  const people = list(values, "people").slice(0, 4);
  if (people.length === 0) return null;

  return (
    <FullCard values={values} ground={ground}>
      <ul className={fullCardGrid(people.length)}>
        {people.map((person, index) => (
          <li key={index} className={FULL_CARD_CELL}>
            <TurnIcon name={person.icon} index={index} className="mb-5" />
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
    </FullCard>
  );
}
