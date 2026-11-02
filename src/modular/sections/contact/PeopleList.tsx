import { ItemIcon, LeadMark } from "@/modular/cards/CardIcon";
import { itemMark, type IconMode, type ItemMark } from "@/modular/item-marks";
import { Rows } from "@/modular/cards/Rows";
import { DISC_ROW, INNER_EYEBROW, ITEM_TITLE, leadRow } from "@/modular/styles";
import type { ListItem, SectionGround } from "@/types/modular";
import { ContactLines } from "./ContactLines";

/**
 * The people as rows between hairlines (`Rows`), as Transportation's Two-line &
 * list: each person's role over the row, their name, their number and email
 * under it where a way's note goes, their icon on a soft disc at the row's
 * end, every disc in the secondary: Two-line & list (`3`).
 * `numbered`, Icon & list (`4`): as Accommodation's and Transportation's
 * Icon & list, their mark (`LeadMark`: icon or number 01, 02…) bare before the row, in a
 * column as wide as the schedule's times (`TIME_COLUMN`), in the accent, and on a phone the list 350px at most, centred. With
 * `cards` on `ground`, each row a card on the other surface, stacked, as
 * Special people's: Two-line & cards (`5`) and Icon & cards (`6`).
 */
export function PeopleList({
  people,
  mode,
  numbered = false,
  cards,
}: {
  people: ListItem[];
  /** The section's `iconMode`: each person's mark, at the row's end or (`numbered`) before it. */
  mode: IconMode;
  numbered?: boolean;
  /** The section's ground: each person a card on the other surface. */
  cards?: SectionGround;
}) {
  return (
    <Rows items={people} cards={cards} narrow={numbered}>
      {(person, index) =>
        numbered ? (
          <LeadRow person={person} mark={itemMark(mode, person.icon, index)} />
        ) : (
          <EndRow person={person} mark={itemMark(mode, person.icon, index)} />
        )
      }
    </Rows>
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
function EndRow({ person, mark }: { person: ListItem; mark: ItemMark }) {
  return (
    <>
      <Role person={person} className="mb-1" />
      <div className={`${DISC_ROW} items-start py-3`}>
        <Person person={person} />
        <ItemIcon mark={mark} className="self-center" />
      </div>
    </>
  );
}

/** Icon & list's row, as Transportation's `WayRow`: the mark (`LeadMark`), then the role over the person. */
function LeadRow({ person, mark }: { person: ListItem; mark: ItemMark }) {
  return (
    <div className={`${leadRow(mark)} pb-3 ${person.role ? "" : "pt-3"}`}>
      <LeadMark mark={mark} />
      <div className="min-w-0">
        <Role person={person} className="mb-4" />
        <Person person={person} />
      </div>
    </div>
  );
}
