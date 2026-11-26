import { formatTime, groups, scheduleDay } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  CARD,
  COLUMN,
  CARD_GRID,
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
import type { SectionGround, VariantProps } from "@/types/modular";

/**
 * The section's heading centred, the eyebrow over it and the note under
 * it — no italic line — and each day a card on the other surface, side by
 * side once there is room (`cardColumns`). In each card, centred: the day's date in
 * the accent, only when there is more than one day, then its events one
 * under another, each its time as an eyebrow in the secondary over its
 * title and note. No icons by the events. Cards (`5`); with `accent`, the
 * cards on the accent, everything in them in the accent's ink: Cards
 * accent (`9`).
 * Cards hard (`5`, its `card` `surface-alt`), Cards soft (`16`,
 * `surface`), Cards accent (`9`): all bare, the page's pattern round
 * the cards, so the heading is a sticker (`SectionHeading`'s `sticker`).
 */
export function DayCards({
  values,
  language,
  ground,
  accent = false,
  card = otherGround(ground),
}: VariantProps & {
  accent?: boolean;
  /** The cards' ground when not on the accent: the other surface from `ground` unless given. */
  card?: SectionGround;
}) {
  const days = groups(values, "days");

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} sticker />
      {days.length > 0 ? (
        <ol className={`${CARD_GRID} text-center ${cardColumns(days.length)}`}>
          {days.map((day, index) => {
            const date = scheduleDay(day.values.date ?? "", language);
            return (
              <li
                key={index}
                className={`${CARD} ${COLUMN} ${GROUND[accent ? "accent" : card]}`}
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
