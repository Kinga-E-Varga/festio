import { groups } from "@/modular/content";
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
 * A clock on its soft disc over the heading — no eyebrow — beside the days: each event a row between hairlines, its
 * time large in the body face, taking turns by day — the secondary,
 * then the accent — its title and note
 * beside it. No icons by the events. A day's label stands above its rows,
 * only when there is more than one day.
 */
export function Variant({ values, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${SPLIT} ${GROUND[ground]} ${PAD}`}>
      <IconHeading icon="clock" values={values} />
      {days.length > 0 ? (
        <ol className="flex flex-col gap-10">
          {days.map((day, index) => (
            <li key={index}>
              {day.values.label && days.length > 1 ? (
                <p className={`${INNER_EYEBROW} ${MUTED} mb-3`}>
                  {day.values.label}
                </p>
              ) : null}
              {day.items.length > 0 ? (
                <ul className="border-t-1 border-[var(--m-line)]">
                  {day.items.map((event, eventIndex) => (
                    <li
                      key={eventIndex}
                      className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-3 border-b-1 border-[var(--m-line)] py-5"
                    >
                      {/*
                       * The time and the title share the first row, centred
                       * on each other; the note is a row of its own under
                       * the title.
                       */}
                      <span
                        className={`text-[24px] leading-none font-semibold tracking-[0.03em] ${index % 2 === 0 ? TONE_TEXT.secondary : TONE_TEXT.accent} tabular-nums`}
                      >
                        {event.time}
                      </span>
                      <h3 className={`${ITEM_TITLE} min-w-0`}>{event.title}</h3>
                      {event.note ? (
                        <p
                          className={`${BODY_SM} ${MUTED} col-start-2 mt-1.5 min-w-0`}
                        >
                          {event.note}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
