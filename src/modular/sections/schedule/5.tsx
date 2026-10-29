import { formatTime, groups, scheduleDay } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  CARD,
  COLUMN,
  cardColumns,
  EYEBROW,
  GROUND,
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
 * it — no italic line — and each day a card on the other surface, side by
 * side from `@3xl` (`cardColumns`). In each card, centred: the day's date in
 * the accent, only when there is more than one day, then its events one
 * under another, each its time as an eyebrow in the secondary over its
 * title and note. No icons by the events.
 */
export function Variant({ values, language, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {days.length > 0 ? (
        <ol
          className={`grid gap-3 text-center @3xl:gap-4 ${cardColumns(days.length)}`}
        >
          {days.map((day, index) => {
            const date = scheduleDay(day.values.date ?? "", language);
            return (
              <li
                key={index}
                className={`${CARD} ${COLUMN} ${GROUND[otherGround(ground)]}`}
              >
                {date && days.length > 1 ? (
                  <p className={`${EYEBROW} ${TONE_TEXT.accent} mb-6`}>
                    {date}
                  </p>
                ) : null}
                {day.items.length > 0 ? (
                  <ul className="flex flex-col gap-6">
                    {day.items.map((event, eventIndex) => (
                      <li key={eventIndex}>
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
