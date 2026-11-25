import { ItemIcon, LeadMark } from "@/modular/cards/CardIcon";
import { Rows } from "@/modular/cards/Rows";
import { itemMark, type IconMode, type ItemMark } from "@/modular/item-marks";
import {
  DISC_ROW,
  INNER_EYEBROW,
  ITEM_TITLE,
  leadRow,
  turnTone,
} from "@/modular/styles";
import type { ListItem, SectionGround } from "@/types/modular";
import { Names } from "./Names";

/**
 * The groups as rows between hairlines (`Rows`), as Transportation's Two-line &
 * list: each group's label over the row, its names under it, where a way's
 * title goes. Two-line & list (`3`), `icons="end"`: its icon on a soft disc
 * at the row's end, every disc in the secondary. Icon & list
 * (`4`), `icons="start"`: laid out as Transportation's Icon & list, its icon
 * bare where a way's number goes, in a column as wide (`TIME_COLUMN`), 26px,
 * a little over the number, in the muted ink, and on a phone the
 * list 350px at most, centred. With `cards` on `ground`, each group a card
 * on the other surface, stacked, no marks, the text centred, as
 * Transportation's: Two-line & cards (`5`) and Icon & cards (`6`).
 */
export function GroupList({
  groups,
  mode = "none",
  icons = "start",
  cards,
}: {
  groups: ListItem[];
  /** The section's `iconMode`: each group's mark, by the switches. */
  mode?: IconMode;
  icons?: "start" | "end";
  /** The section's ground: each group a centred card on the other surface. */
  cards?: SectionGround;
}) {
  return (
    <Rows items={groups} cards={cards} narrow={icons === "start"}>
      {(group, index) => {
        if (cards) return <LeadRow group={group} mark={null} centred />;
        const mark = itemMark(mode, group.icon, index);
        return icons === "start" ? (
          <LeadRow group={group} mark={mark} centred={false} />
        ) : (
          <EndRow
            group={group}
            mark={mark}
            tone={turnTone(index, "secondary")}
          />
        );
      }}
    </Rows>
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
function EndRow({
  group,
  mark,
  tone,
}: {
  group: ListItem;
  mark: ItemMark;
  tone: "accent" | "secondary";
}) {
  return (
    <>
      <Label group={group} className="mb-1" />
      <div className={`${DISC_ROW} items-start py-3`}>
        <div className="min-w-0">
          <Names names={group.names} className={ITEM_TITLE} />
        </div>
        <ItemIcon mark={mark} tone={tone} className="self-center" />
      </div>
    </>
  );
}

/** Icon & list's row, spaced as Transportation's `WayRow`: the icon, then the label over the names. */
function LeadRow({
  group,
  mark,
  centred,
}: {
  group: ListItem;
  mark: ItemMark;
  centred: boolean;
}) {
  return (
    <div
      className={`${leadRow(mark)} pb-3 ${group.label ? "" : "pt-3"} ${centred ? "text-center" : ""}`}
    >
      <LeadMark mark={mark} />
      <div className="min-w-0">
        <Label group={group} className="mb-4" />
        <Names names={group.names} className={ITEM_TITLE} />
      </div>
    </div>
  );
}
