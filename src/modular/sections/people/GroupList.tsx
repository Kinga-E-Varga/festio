import { TurnIcon } from "@/modular/cards/CardIcon";
import { Icon, isIconName } from "@/modular/icons";
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
import { Names } from "./Names";

/**
 * The groups as rows between hairlines, as Transportation's Two-line &
 * list: each group's label over the row, its names under it, where a way's
 * title goes. Two-line & list (`3`), `icons="end"`: its icon on a soft disc
 * at the row's end, the discs taking turns accent / secondary. Icon & list
 * (`4`), `icons="start"`: laid out as Transportation's Icon & list, its icon
 * bare where a way's number goes, in a column as wide (`TIME_COLUMN`), 26px,
 * a little over the number, taking turns accent / secondary, and on a phone the
 * list 350px at most, centred. With `cards` on `ground`, each row a card
 * on the other surface, stacked, as Transportation's Two-line & cards and
 * Icon & cards: Two-line & cards (`5`) and Icon & cards (`6`).
 */
export function GroupList({
  groups,
  icons,
  cards,
}: {
  groups: ListItem[];
  icons: "start" | "end";
  /** The section's ground: each group a card on the other surface. */
  cards?: SectionGround;
}) {
  if (groups.length === 0) return null;

  return (
    <ul
      className={
        cards
          ? CARD_STACK
          : `border-t-1 border-[var(--m-line)] ${icons === "start" ? "mx-auto w-full max-w-[350px] @3xl:mx-0 @3xl:max-w-none" : ""}`
      }
    >
      {groups.map((group, index) => (
        <li
          key={index}
          className={
            cards
              ? otherCard(cards)
              : "border-b-1 border-[var(--m-line)] pt-4 pb-3"
          }
        >
          {icons === "start" ? (
            <LeadRow group={group} index={index} />
          ) : (
            <EndRow group={group} index={index} />
          )}
        </li>
      ))}
    </ul>
  );
}

/** The label in the secondary over the names. */
function Label({ group, className }: { group: ListItem; className: string }) {
  return group.label ? (
    <p
      className={`${INNER_EYEBROW} ${className} text-[color:var(--m-secondary)]`}
    >
      {group.label}
    </p>
  ) : null;
}

/** Two-line & list's row: the label, then the names and the icon on its disc. */
function EndRow({ group, index }: { group: ListItem; index: number }) {
  return (
    <>
      <Label group={group} className="mb-1" />
      <div className="grid grid-cols-[minmax(0,1fr)_2.375rem] items-start gap-6 py-3">
        <div className="min-w-0">
          <Names names={group.names} className={ITEM_TITLE} />
        </div>
        <TurnIcon name={group.icon} index={index} className="self-center" />
      </div>
    </>
  );
}

/** Icon & list's row, spaced as Transportation's `WayRow`: the icon, then the label over the names. */
function LeadRow({ group, index }: { group: ListItem; index: number }) {
  return (
    <div
      className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 pb-3 ${group.label ? "" : "pt-3"}`}
    >
      <span className={`${TIME_COLUMN} ${TONE_TEXT[turnTone(index)]}`}>
        {isIconName(group.icon) ? (
          <Icon name={group.icon} className="block size-6.5" />
        ) : null}
      </span>
      <div className="min-w-0">
        <Label group={group} className="mb-4" />
        <Names names={group.names} className={ITEM_TITLE} />
      </div>
    </div>
  );
}
