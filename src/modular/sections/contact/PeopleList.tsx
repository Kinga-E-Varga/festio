import { TurnIcon } from "@/modular/cards/CardIcon";
import {
  CARD_STACK,
  INNER_EYEBROW,
  ITEM_TITLE,
  TIME_COLUMN,
  TONE_TEXT,
  otherCard,
  turnTone,
} from "@/modular/styles";
import type { ListItem, SectionGround } from "@/types/modular";
import { ContactLines } from "./ContactLines";

/**
 * The people as rows between hairlines, as Transportation's Two-line &
 * list: each person's role over the row, their name, their number and email
 * under it where a way's note goes, their icon on a soft disc at the row's
 * end, the discs taking turns accent / secondary: Two-line & list (`3`).
 * `numbered`, Icon & list (`4`): as Accommodation's and Transportation's
 * Icon & list, no icons, their number (01, 02…) large before the row, in a
 * column as wide as the schedule's times (`TIME_COLUMN`), taking turns
 * accent / secondary, and on a phone the list 350px at most, centred. With
 * `cards` on `ground`, each row a card on the other surface, stacked, as
 * Special people's: Two-line & cards (`5`) and Icon & cards (`6`).
 */
export function PeopleList({
  people,
  numbered = false,
  cards,
}: {
  people: ListItem[];
  numbered?: boolean;
  /** The section's ground: each person a card on the other surface. */
  cards?: SectionGround;
}) {
  if (people.length === 0) return null;

  return (
    <ul
      className={
        cards
          ? CARD_STACK
          : `border-t-1 border-[var(--m-line)] ${numbered ? "mx-auto w-full max-w-[350px] @3xl:mx-0 @3xl:max-w-none" : ""}`
      }
    >
      {people.map((person, index) => (
        <li
          key={index}
          className={
            cards
              ? otherCard(cards)
              : "border-b-1 border-[var(--m-line)] pt-4 pb-3"
          }
        >
          {numbered ? (
            <LeadRow person={person} index={index} />
          ) : (
            <EndRow person={person} index={index} />
          )}
        </li>
      ))}
    </ul>
  );
}

/** The role in the secondary over the row. */
function Role({ person, className }: { person: ListItem; className: string }) {
  return person.role ? (
    <p
      className={`${INNER_EYEBROW} ${className} text-[color:var(--m-secondary)]`}
    >
      {person.role}
    </p>
  ) : null;
}

/** The name, the number and email under it. */
function Person({ person }: { person: ListItem }) {
  return (
    <div className="flex min-w-0 flex-col items-start">
      {person.name ? (
        <h3 className={`${ITEM_TITLE} mb-1`}>{person.name}</h3>
      ) : null}
      <ContactLines person={person} />
    </div>
  );
}

/** Two-line & list's row: the role, then the person and the icon on its disc. */
function EndRow({ person, index }: { person: ListItem; index: number }) {
  return (
    <>
      <Role person={person} className="mb-1" />
      <div className="grid grid-cols-[minmax(0,1fr)_2.375rem] items-start gap-6 py-3">
        <Person person={person} />
        <TurnIcon name={person.icon} index={index} className="self-center" />
      </div>
    </>
  );
}

/** Icon & list's row, as Transportation's `WayRow`: the number, then the role over the person. */
function LeadRow({ person, index }: { person: ListItem; index: number }) {
  return (
    <div
      className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 pb-3 ${person.role ? "" : "pt-3"}`}
    >
      <span className={`${TIME_COLUMN} ${TONE_TEXT[turnTone(index)]}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <Role person={person} className="mb-4" />
        <Person person={person} />
      </div>
    </div>
  );
}
