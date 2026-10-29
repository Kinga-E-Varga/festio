import { timeParts } from "@/modular/content";
import {
  BODY_SM,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  TIME_COLUMN,
  TONE_TEXT,
  turnTone,
} from "@/modular/styles";
import type { Language } from "@/lib/language";
import type { Group } from "@/types/modular";

/** A day's colour, by its place: the 1st, 3rd… the accent, the 2nd, 4th… the secondary, as Two-line & list's. */
export function clockTone(index: number) {
  return TONE_TEXT[turnTone(index)];
}

/**
 * One day's events of Icon & list (`2`) and Icon & cards (`7`): each a row,
 * its time large in the body face in the day's colour (`tone`), its title
 * and note beside it, centred on each other. No icons by the events.
 */
export function ClockEvents({
  day,
  tone,
  language,
}: {
  day: Group;
  tone: string;
  language: Language;
}) {
  if (day.items.length === 0) return null;
  return (
    <ul>
      {day.items.map((event, eventIndex) => (
        <li
          key={eventIndex}
          className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 py-3"
        >
          {/*
           * The time in a column of its own, the title and note stacked
           * beside it; am or pm on a line of its own under the clock,
           * whatever the font's width.
           */}
          <TimeStack time={event.time} language={language} className={tone} />
          <div className="min-w-0">
            <h3 className={ITEM_TITLE}>{event.title}</h3>
            {event.note ? (
              <p className={`${BODY_SM} ${MUTED} mt-1`}>{event.note}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * A day's date over its `ClockEvents` in its times' colour, in line with
 * their titles: an empty time column first. 4px over the first row's
 * padding, 16px from the first title.
 */
export function ClockDate({ date, tone }: { date: string; tone: string }) {
  return (
    <p className={`mb-1 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 ${tone}`}>
      <span aria-hidden="true" className={`${TIME_COLUMN} h-0`} />
      <span className={INNER_EYEBROW}>{date}</span>
    </p>
  );
}

/** The clock, and am or pm under it when the language writes one. */
function TimeStack({
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
    <span className={`flex flex-col ${TIME_COLUMN} ${className}`}>
      <span>{clock}</span>
      {meridiem ? <span>{meridiem}</span> : null}
    </span>
  );
}
