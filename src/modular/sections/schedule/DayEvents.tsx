import { formatTime, scheduleDay } from "@/modular/content";
import { ItemIcon } from "@/modular/cards/CardIcon";
import { itemMark, type IconMode } from "@/modular/item-marks";
import {
  BODY_SM,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  TIME_COLUMN,
  turnTone,
} from "@/modular/styles";
import type { Language } from "@/lib/language";
import type { Group } from "@/types/modular";

/**
 * One day of Two-line & list (`1`) and Two-line & cards (`6`): its date in
 * the secondary, only with `showDate`, over its events, each a row: the
 * time, the title and note, the icon on a soft disc, centred on the row,
 * 24px from the text (the gap and the text's own 12px), as in
 * Transportation's Two-line & list; its column exactly the disc's width.
 * The discs take turns by day (`index`) — the 1st, 3rd… in the secondary,
 * as the other Two-line lists' (`ItemIcon`), the 2nd, 4th… in the accent.
 * The icons can be numbers, or off, by the section's switches (`mode`); an
 * event with no known icon simply has none.
 */
export function DayEvents({
  day,
  index,
  mode,
  showDate,
  language,
}: {
  day: Group;
  index: number;
  /** The section's `iconMode`: each event's mark, numbered from 01 each day. */
  mode: IconMode;
  showDate: boolean;
  language: Language;
}) {
  const date = showDate ? scheduleDay(day.values.date ?? "", language) : "";

  return (
    <>
      {date ? (
        <p className={`${INNER_EYEBROW} mb-1 text-[color:var(--m-secondary)]`}>
          {date}
        </p>
      ) : null}
      {day.items.length > 0 ? (
        <ul>
          {day.items.map((event, eventIndex) => (
            <li
              key={eventIndex}
              className="grid grid-cols-[auto_minmax(0,1fr)_2.375rem] items-start gap-3 py-3"
            >
              {/*
               * The time's column as wide as Icon & list's large times
               * (`TIME_COLUMN`, held open by an empty line), so the
               * schedules' titles start alike.
               */}
              <span className="flex flex-col">
                <span aria-hidden="true" className={`${TIME_COLUMN} h-0`} />
                <span className={`${BODY_SM} ${MUTED} pt-0.5 tabular-nums`}>
                  {formatTime(event.time, language)}
                </span>
              </span>
              <div className="min-w-0 pr-3">
                <h3 className={ITEM_TITLE}>{event.title}</h3>
                {event.note ? (
                  <p className={`${BODY_SM} ${MUTED} mt-1`}>{event.note}</p>
                ) : null}
              </div>
              <ItemIcon
                mark={itemMark(mode, event.icon, eventIndex)}
                tone={turnTone(index, "secondary")}
                className="self-center"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
