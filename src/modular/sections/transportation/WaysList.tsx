import {
  BODY_SM,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  TIME_COLUMN,
  TONE_TEXT,
  turnTone,
  LEAD_ROW,
  NARROW_LIST,
} from "@/modular/styles";
import type { ListItem } from "@/types/modular";

/**
 * The ways of arriving for Icon & list: a hairline above and below and
 * between the ways; each way a row, its number (01, 02…) large in the body
 * face, taking turns accent / secondary, where the schedule has the time,
 * its column as wide as the schedule's (`TIME_COLUMN`), its eyebrow, title
 * and note beside it, centred on each other; spaced as Two-line & list:
 * 16px over the eyebrow, or 28px over the title without one, and 24px
 * under. On a phone the list is 350px at most, centred.
 */
export function WaysList({ ways }: { ways: ListItem[] }) {
  if (ways.length === 0) return null;
  return (
    <ul className={`${NARROW_LIST} border-y-1 border-[var(--m-line)]`}>
      {ways.map((way, index) => (
        <li
          key={index}
          className="border-[var(--m-line)] pt-4 pb-3 not-last:border-b-1"
        >
          <WayRow way={way} index={index} />
        </li>
      ))}
    </ul>
  );
}

/**
 * One way: its number (01, 02…) large, taking turns accent / secondary, in
 * a column as wide as the schedule's times (`TIME_COLUMN`), its eyebrow,
 * title and note beside it, centred on each other. The lists' rows and
 * Icon & cards' cards, padded as a schedule's event: 12px under the note,
 * and over the title when there is no eyebrow (an eyebrow takes the
 * place of a schedule's date).
 */
export function WayRow({ way, index }: { way: ListItem; index: number }) {
  return (
    <div className={`${LEAD_ROW} pb-3 ${way.label ? "" : "pt-3"}`}>
      <span className={`${TIME_COLUMN} ${TONE_TEXT[turnTone(index)]}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
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
