import { formatTime, groups, scheduleDay } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import {
  BODY_SM,
  GROUND,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  PAD,
  SPLIT,
  TONE_TEXT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * A clock on its soft disc over the heading — no eyebrow, no italic line — beside the days: each event a row between hairlines, its
 * time large in the body face, taking turns by day — the secondary,
 * then the accent — its title and note
 * beside it. No icons by the events. A day's date stands above its rows,
 * only when there is more than one day.
 */
export function Variant({ values, language, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${SPLIT} ${GROUND[ground]} ${PAD}`}>
      <IconHeading icon="clock" values={values} />
      {days.length > 0 ? (
        <ol className="flex flex-col gap-10">
          {days.map((day, index) => {
            const date = scheduleDay(day.values.date ?? "", language);
            return (
              <li key={index}>
                {date && days.length > 1 ? (
                  <p className={`${INNER_EYEBROW} ${MUTED} mb-3`}>{date}</p>
                ) : null}
                {day.items.length > 0 ? (
                  <ul className="border-t-1 border-[var(--m-line)]">
                    {day.items.map((event, eventIndex) => (
                      <li
                        key={eventIndex}
                        className="grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-x-3 border-b-1 border-[var(--m-line)] py-5"
                      >
                        {/*
                         * The time in a column of its own, the title and note
                         * stacked beside it: a time that wraps ("3:30 / pm")
                         * never pushes the note away from the title.
                         */}
                        <span
                          className={`pt-0.5 text-[24px] leading-none font-semibold tracking-[0.03em] ${index % 2 === 0 ? TONE_TEXT.secondary : TONE_TEXT.accent} tabular-nums`}
                        >
                          {formatTime(event.time, language)}
                        </span>
                        <div className="min-w-0">
                          <h3 className={ITEM_TITLE}>{event.title}</h3>
                          {event.note ? (
                            <p className={`${BODY_SM} ${MUTED} mt-1.5`}>
                              {event.note}
                            </p>
                          ) : null}
                        </div>
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
