import { formatTime, groups, scheduleDay } from "@/modular/content";
import { MarkGlyph } from "@/modular/cards/CardIcon";
import { iconMode, itemMark } from "@/modular/item-marks";
import {
  BODY_SM,
  EYEBROW,
  CARD_DISC,
  H3,
  MUTED,
  PAGE_SECONDARY,
  TONES,
  TONE_TEXT,
  turnTone,
  TIMELINE,
  TIMELINE_STOP,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

type Tone = "accent" | "secondary";

/* On the accent, the secondary is the accent's ink; a disc takes the palette's own back. */
const ICON_SECONDARY = `${TONES.secondary} ${PAGE_SECONDARY}`;
/* A dot without an icon, on the accent: the icon disc's fill. */
const DOT_SECONDARY = "text-[color:var(--m-secondary-soft)]";

/**
 * Timeline's (`4`) days: one line down the middle from the first stop to
 * the last (see `Variant` in `4.tsx`). On the accent (`accent`: Timeline
 * accent, `10`, and Full card timeline accent, `11`) the discs in the palette's
 * own secondary, every day, a dot the discs' soft fill.
 */
export function TimelineDays({
  values,
  language,
  accent = false,
}: Pick<VariantProps, "values" | "language"> & { accent?: boolean }) {
  const days = groups(values, "days").map((day) => ({
    ...day,
    date: scheduleDay(day.values.date ?? "", language),
  }));
  const dated = days.length > 1;
  // Each day's first stop on the line (its date, then its events) and first event, counted from the start.
  const stops = days.map(
    (day) => (dated && day.date ? 1 : 0) + day.items.length,
  );
  const firstStop = stops.map((_, index) => sum(stops.slice(0, index)));
  const firstEvent = days.map((_, index) =>
    sum(days.slice(0, index).map((day) => day.items.length)),
  );
  const lastStop = sum(stops) - 1;
  const mode = iconMode(values);

  if (days.length === 0) return null;
  // The discs' colour: their day's, on the accent all the palette's own secondary.
  const disc = (tone: Tone) => (accent ? ICON_SECONDARY : TONES[tone]);
  const dot = (tone: Tone) => (accent ? DOT_SECONDARY : TONE_TEXT[tone]);

  return (
    <ol className={TIMELINE}>
      {days.map((day, index) => {
        const tone = turnTone(index, "secondary");
        const dateStop = dated && day.date ? firstStop[index] : null;
        return (
          <li key={index}>
            {dateStop !== null ? (
              /*
               * On a phone the date beside the line, which runs on past
               * it; centred on a wide page, the line stops a little
               * above it and goes on a little below.
               */
              <div className="relative pb-6 @3xl:flex @3xl:flex-col @3xl:items-center @3xl:pb-0">
                <Line
                  first={dateStop === 0}
                  last={dateStop === lastStop}
                  centre="top-1/2"
                  end="bottom-1/2"
                  tone={tone}
                  className="@3xl:hidden"
                />
                <p className={`${EYEBROW} ${MUTED} pl-13 @3xl:py-2 @3xl:pl-0`}>
                  {day.date}
                </p>
                {dateStop !== lastStop ? (
                  /* From the middle, as the stops' line (`Line`): centred, it sat half a pixel left of it. */
                  <span
                    aria-hidden="true"
                    className={`hidden h-6 w-px self-start bg-current/50 @3xl:ml-[50%] @3xl:block ${TONE_TEXT[tone]}`}
                  />
                ) : null}
              </div>
            ) : null}
            {day.items.length > 0 ? (
              <ul>
                {day.items.map((event, eventIndex) => {
                  const stop =
                    firstStop[index] +
                    stops[index] -
                    day.items.length +
                    eventIndex;
                  const left = (firstEvent[index] + eventIndex) % 2 === 0;
                  // Numbered from 01 again each day.
                  const mark = itemMark(mode, event.icon, eventIndex);
                  return (
                    <li key={eventIndex} className={TIMELINE_STOP}>
                      <span className="relative col-start-1 row-start-1 flex justify-center @3xl:col-start-2">
                        <Line
                          first={stop === 0}
                          last={stop === lastStop}
                          centre="top-4.75"
                          end="bottom-auto h-4.75"
                          tone={tone}
                        />
                        {mark ? (
                          <span
                            className={`${CARD_DISC} relative ${disc(tone)}`}
                          >
                            <MarkGlyph mark={mark} iconClass="size-5.5" />
                          </span>
                        ) : (
                          <span
                            className={`${CARD_DISC} relative ${dot(tone)}`}
                          >
                            <span className="size-2.5 rounded-full bg-current" />
                          </span>
                        )}
                      </span>
                      <div
                        className={`col-start-2 row-start-1 min-w-0 pt-1.5 ${stop === lastStop ? "" : "pb-9"} ${left ? "@3xl:col-start-1 @3xl:text-right" : "@3xl:col-start-3"}`}
                      >
                        <p
                          className={`${EYEBROW} ${TONE_TEXT[tone]} mb-4 tabular-nums`}
                        >
                          {formatTime(event.time, language)}
                        </p>
                        <h3 className={H3}>{event.title}</h3>
                        {event.note ? (
                          <p className={`${BODY_SM} ${MUTED} mt-1`}>
                            {event.note}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function sum(numbers: number[]) {
  return numbers.reduce((total, n) => total + n, 0);
}

/**
 * The line through one stop: from its top to its bottom, so the stops'
 * pieces join — but from its centre on the first stop and to its centre on
 * the last. In the middle on a wide page, under the discs on a phone. Not
 * centred with a translate: that puts a 1px line on a half pixel and blurs
 * it; a half pixel off centre doesn't show.
 */
function Line({
  first,
  last,
  centre,
  end,
  tone,
  className = "",
}: {
  first: boolean;
  last: boolean;
  /** Its day's colour, as the discs'. */
  tone: Tone;
  /** Where the line starts on the first stop. */
  centre: string;
  /** Where it stops on the last. */
  end: string;
  className?: string;
}) {
  if (first && last) return null;
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-y-0 left-4.75 w-px bg-current/50 @3xl:left-1/2 ${TONE_TEXT[tone]} ${first ? centre : ""} ${last ? end : ""} ${className}`}
    />
  );
}
