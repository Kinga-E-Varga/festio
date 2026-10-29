import { formatTime, scheduleDay } from "@/modular/content";
import { Icon, isIconName } from "@/modular/icons";
import {
  BODY_SM,
  INNER_EYEBROW,
  ITEM_TITLE,
  CARD_DISC,
  MUTED,
  TIME_COLUMN,
  TONES,
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
 * The icons take turns by day (`index`) — the 1st, 3rd… in the accent, the
 * 2nd, 4th… in the secondary. An event with no known icon simply has none.
 */
export function DayEvents({
  day,
  index,
  showDate,
  language,
}: {
  day: Group;
  index: number;
  showDate: boolean;
  language: Language;
}) {
  const tone = TONES[turnTone(index)];
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
              {isIconName(event.icon) ? (
                <span className={`${CARD_DISC} self-center ${tone}`}>
                  <Icon name={event.icon} className="size-5.5" />
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
