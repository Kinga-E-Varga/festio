import { groups } from "@/modular/content";
import { Icon, isIconName } from "@/modular/icons";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  BODY_SM,
  EYEBROW,
  GROUND,
  H4,
  ICON_DISC,
  MUTED,
  PAD,
  SPLIT,
  TONES,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The heading beside the days, each with its events. No day is singled
 * out: the icons take turns by day — the 1st, 3rd… in the accent, the 2nd,
 * 4th… in the secondary. An event with no known icon simply has none.
 */
export function Variant({ values, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${SPLIT} ${GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      {days.length > 0 ? (
        <ol className={`border-t-1 border-[var(--m-line)]`}>
          {days.map((day, index) => {
            const tone = index % 2 === 0 ? TONES.accent : TONES.secondary;
            return (
              <li
                key={index}
                className="border-b-1 border-[var(--m-line)] pt-4 pb-3"
              >
                {day.values.label ? (
                  <p
                    className={`${EYEBROW} mb-1.5 text-[color:var(--m-secondary)]`}
                  >
                    {day.values.label}
                  </p>
                ) : null}
                {day.items.length > 0 ? (
                  <ul>
                    {day.items.map((event, eventIndex) => (
                      <li
                        key={eventIndex}
                        className="grid grid-cols-[3.25rem_1fr_2.5rem] items-start gap-3 py-3 @3xl:grid-cols-[4rem_1fr_2.5rem]"
                      >
                        <span
                          className={`${BODY_SM} ${MUTED} pt-0.5 tabular-nums`}
                        >
                          {event.time}
                        </span>
                        <div className="min-w-0">
                          <h3 className={`${H4} text-[color:var(--m-ink)]`}>
                            {event.title}
                          </h3>
                          {event.note ? (
                            <p className={`${BODY_SM} ${MUTED} mt-1`}>
                              {event.note}
                            </p>
                          ) : null}
                        </div>
                        {isIconName(event.icon) ? (
                          <span className={`${ICON_DISC} size-10 ${tone}`}>
                            <Icon name={event.icon} className="size-5" />
                          </span>
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
