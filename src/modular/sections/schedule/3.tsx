import { formatTime, groups, scheduleDay } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  columnsFor,
  EYEBROW,
  H3_ITEM,
  MUTED,
  PAD,
  STACK,
  TONE_TEXT,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The section's heading centred, the eyebrow over it and the note under
 * it — no italic line — and the days under them across the full width,
 * side by side from `@3xl` (`columnsFor`), 40px apart, no lines. Each
 * event a centred row: its time as an eyebrow in the secondary over its
 * title and note. No icons by the events. A day's date stands above its
 * rows in the accent, only when there is more than one day, 8px down from
 * `@3xl` as the Timeline's. The rows'
 * padding is pulled in at the day's ends (at its top too without a date),
 * so the days sit the stack's gap under the heading and 40px apart.
 */
export function Variant({ values, language, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {days.length > 0 ? (
        <ol
          className={`grid w-full gap-10 text-center @3xl:gap-y-12 ${columnsFor(days.length)}`}
        >
          {days.map((day, index) => {
            const date =
              days.length > 1
                ? scheduleDay(day.values.date ?? "", language)
                : "";
            return (
              <li key={index}>
                {date ? (
                  <p
                    className={`${EYEBROW} ${TONE_TEXT.accent} mb-3 @3xl:pt-2`}
                  >
                    {date}
                  </p>
                ) : null}
                {day.items.length > 0 ? (
                  <ul className={date ? "-mb-5" : "-my-5"}>
                    {day.items.map((event, eventIndex) => (
                      <li key={eventIndex} className="py-5">
                        <p
                          className={`${EYEBROW} ${TONE_TEXT.secondary} mb-4 tabular-nums`}
                        >
                          {formatTime(event.time, language)}
                        </p>
                        <h3 className={H3_ITEM}>{event.title}</h3>
                        {event.note ? (
                          <p className={`${BODY_SM} ${MUTED} mt-1`}>
                            {event.note}
                          </p>
                        ) : null}
                      </li>
                    ))}
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
