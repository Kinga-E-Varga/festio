import { formatTime, groups, scheduleDay } from "@/modular/content";
import { Icon, isIconName } from "@/modular/icons";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  EYEBROW,
  CARD_DISC,
  H3,
  MUTED,
  PAD,
  TONES,
  TONE_TEXT,
  SECTION_GROUND,
  STACK,
  turnTone,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The full cards' heading, eyebrow and heading only, centred over the
 * timeline: one line down the middle from the first
 * stop to the last, on through the days, stopping only around a centred
 * date; each event's icon on a soft disc on it — a small dot where it has
 * none — and the events taking turns left and right, on across the days.
 * Each event its time as an eyebrow over its title and note; those on the
 * left lean on the line. The discs, the times and the line (at 50%) take turns by
 * day: the 1st, 3rd… in the accent, the 2nd, 4th… in the secondary. A day's
 * date in the muted ink stands above its events, only when there is more
 * than one day. On a phone the line runs down the left, every event and
 * date right of it, the whole no wider than 350px and centred.
 */
export function Variant({ values, language, ground }: VariantProps) {
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

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {days.length > 0 ? (
        <ol className="mx-auto w-full max-w-[350px] @3xl:max-w-240">
          {days.map((day, index) => {
            const tone = turnTone(index);
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
                    <p
                      className={`${EYEBROW} ${MUTED} pl-13 @3xl:py-2 @3xl:pl-0`}
                    >
                      {day.date}
                    </p>
                    {dateStop !== lastStop ? (
                      <span
                        aria-hidden="true"
                        className={`hidden h-6 w-px bg-current/50 @3xl:block ${TONE_TEXT[tone]}`}
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
                      return (
                        <li
                          key={eventIndex}
                          className="grid grid-cols-[2.375rem_minmax(0,1fr)] gap-x-4 @3xl:grid-cols-[minmax(0,1fr)_2.375rem_minmax(0,1fr)] @3xl:gap-x-6"
                        >
                          <span className="relative col-start-1 row-start-1 flex justify-center @3xl:col-start-2">
                            <Line
                              first={stop === 0}
                              last={stop === lastStop}
                              centre="top-4.75"
                              end="bottom-auto h-4.75"
                              tone={tone}
                            />
                            {isIconName(event.icon) ? (
                              <span
                                className={`${CARD_DISC} relative ${TONES[tone]}`}
                              >
                                <Icon name={event.icon} className="size-5.5" />
                              </span>
                            ) : (
                              <span
                                className={`${CARD_DISC} relative ${TONE_TEXT[tone]}`}
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
      ) : null}
    </div>
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
  tone: "accent" | "secondary";
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
