import {
  BODY_SM,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  NARROW_LIST,
  leadRow,
} from "@/modular/styles";
import { LeadMark } from "@/modular/cards/CardIcon";
import { itemMark, type IconMode, type ItemMark } from "@/modular/item-marks";
import type { ListItem } from "@/types/modular";

/**
 * The ways of arriving for Icon & list: a hairline above and below and
 * between the ways; each way a row, its mark (`LeadMark`: its icon, or its
 * number 01, 02… large in the body face) in the accent, where the schedule has the time,
 * its column as wide as the schedule's (`TIME_COLUMN`), its eyebrow, title
 * and note beside it, centred on each other; spaced as Two-line & list:
 * 16px over the eyebrow, or 28px over the title without one, and 24px
 * under. On a phone the list is 350px at most, centred.
 */
export function WaysList({
  ways,
  mode,
}: {
  ways: ListItem[];
  /** The section's `iconMode`. */
  mode: IconMode;
}) {
  if (ways.length === 0) return null;
  return (
    <ul className={`${NARROW_LIST} border-y-1 border-[var(--m-line)]`}>
      {ways.map((way, index) => (
        <li
          key={index}
          className="border-[var(--m-line)] pt-4 pb-3 not-last:border-b-1"
        >
          <WayRow way={way} mark={itemMark(mode, way.icon, index)} />
        </li>
      ))}
    </ul>
  );
}

/**
 * One way: its mark (`LeadMark`: its icon, or its number 01, 02… large), in the accent, in
 * a column as wide as the schedule's times (`TIME_COLUMN`), its eyebrow,
 * title and note beside it, centred on each other. The lists' rows and
 * Icon & cards' cards, padded as a schedule's event: 12px under the note,
 * and over the title when there is no eyebrow (an eyebrow takes the
 * place of a schedule's date).
 */
export function WayRow({ way, mark }: { way: ListItem; mark: ItemMark }) {
  return (
    <div className={`${leadRow(mark)} pb-3 ${way.label ? "" : "pt-3"}`}>
      <LeadMark mark={mark} />
      <div className="min-w-0">
        {way.label ? (
          <p
            className={`${INNER_EYEBROW} mb-4 text-[color:var(--m-secondary)]`}
          >
            {way.label}
          </p>
        ) : null}
        {way.title ? <h3 className={ITEM_TITLE}>{way.title}</h3> : null}
        {way.text ? (
          <p className={`${BODY_SM} ${MUTED} mt-1 whitespace-pre-line`}>
            {way.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
