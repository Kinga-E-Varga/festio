import { groups, scheduleDay } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SPLIT, SECTION_GROUND, NARROW_LIST } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ClockDate, ClockEvents, clockTone } from "./ClockEvents";

/**
 * A clock on its soft disc over the heading — no eyebrow, no italic line —
 * beside the days, lined as Two-line & list's (`1`): a hairline above the
 * first day and under each, none between the events (`ClockEvents`). A
 * day's date over its events in its times' colour, in line with their
 * titles (past the time column and its gap), only when there is more
 * than one day. On a phone the list is 350px at most, centred, as the
 * Timeline's (`4`).
 */
export function Variant({ values, language, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="clock" values={values} />
      {days.length > 0 ? (
        <ol className={`${NARROW_LIST} border-t-1 border-[var(--m-line)]`}>
          {days.map((day, index) => {
            const date = scheduleDay(day.values.date ?? "", language);
            const tone = clockTone(index);
            return (
              <li
                key={index}
                className="border-b-1 border-[var(--m-line)] pt-4 pb-3"
              >
                {date && days.length > 1 ? (
                  <ClockDate date={date} tone={tone} />
                ) : null}
                <ClockEvents day={day} tone={tone} language={language} />
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
