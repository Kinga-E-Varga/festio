import { scheduleDay, timeParts } from "@/modular/content";
import { ItemIcon } from "@/modular/cards/CardIcon";
import { ClockDate } from "./ClockEvents";
import { itemMark, type IconMode } from "@/modular/item-marks";
import {
  BODY_SM,
  EYEBROW,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  TIME_COLUMN,
  TONE_TEXT,
  turnTone,
} from "@/modular/styles";
import type { Language } from "@/lib/language";
import type { Group } from "@/types/modular";

/**
 * One day of Two-line & list (`1`) and Two-line & cards (`6`): its date,
 * only with `showDate`, in line with the titles as Icon & list's
 * (`ClockDate`), over its events, each a row: the time, the title
 * and note, the icon on a soft disc, centred on the row, 24px from the text
 * (the gap and the text's own 12px), as in Transportation's Two-line &
 * list; its column exactly the disc's width. The date is in the inner
 * eyebrow's style (`INNER_EYEBROW`, as Menu's course labels); a time's
 * numbers in the eyebrow's (`EYEBROW`), its am or pm in the inner one's.
 * Each day takes a tone in turn (`index`) — the 1st, 3rd… in the secondary,
 * as the other Two-line lists' (`ItemIcon`), the 2nd, 4th… in the accent —
 * for its date and its discs. Its times too when it is the only day (no
 * `showDate`); with several days, the dates carry the colour and the times
 * are in the muted ink.
 * The icons can be numbers, or off, by the section's switches (`mode`); an
 * event with no known icon simply has none. With `centred` (Two-line &
 * cards, Icon & cards), no icons, and each event stacked and centred: the
 * time over the title and note, the date centred over them; no turns there,
 * every date in the accent and every time in the secondary.
 */
export function DayEvents({
  day,
  index,
  mode = "none",
  showDate,
  language,
  centred = false,
}: {
  day: Group;
  index: number;
  /** The section's `iconMode`: each event's mark, numbered from 01 each day. */
  mode?: IconMode;
  showDate: boolean;
  language: Language;
  centred?: boolean;
}) {
  const tone = turnTone(index, "secondary");
  const date = showDate ? scheduleDay(day.values.date ?? "", language) : "";
  const timeTone = showDate ? MUTED : TONE_TEXT[tone];

  if (centred) {
    return (
      <>
        {date ? (
          <ClockDate date={date} tone={TONE_TEXT.accent} centred />
        ) : null}
        {day.items.length > 0 ? (
          <ul>
            {day.items.map((event, eventIndex) => (
              <li
                key={eventIndex}
                className="flex flex-col items-center py-3 text-center"
              >
                <EventTime
                  time={event.time}
                  language={language}
                  className={`${TONE_TEXT.secondary} mb-1`}
                />
                <h3 className={ITEM_TITLE}>{event.title}</h3>
                {event.note ? (
                  <p className={`${BODY_SM} ${MUTED} mt-1`}>{event.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </>
    );
  }

  return (
    <>
      {date ? <ClockDate date={date} tone={TONE_TEXT[tone]} /> : null}
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
                <EventTime
                  time={event.time}
                  language={language}
                  className={timeTone}
                />
              </span>
              <div className="min-w-0 pr-3">
                <h3 className={ITEM_TITLE}>{event.title}</h3>
                {event.note ? (
                  <p className={`${BODY_SM} ${MUTED} mt-1`}>{event.note}</p>
                ) : null}
              </div>
              <ItemIcon
                mark={itemMark(mode, event.icon, eventIndex)}
                tone={tone}
                className="self-center"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

/** An event's time: the clock in the eyebrow's style, am or pm in the inner eyebrow's, on one line. */
function EventTime({
  time,
  language,
  className,
}: {
  time: string;
  language: Language;
  className: string;
}) {
  const { clock, meridiem } = timeParts(time, language);
  return (
    <span className={`pt-0.5 tabular-nums ${className}`}>
      <span className={EYEBROW}>{clock}</span>
      {meridiem ? <span className={INNER_EYEBROW}> {meridiem}</span> : null}
    </span>
  );
}
