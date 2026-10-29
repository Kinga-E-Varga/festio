import { groups, scheduleDay } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SPLIT, SECTION_GROUND, otherCard } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ClockDate, ClockEvents, clockTone } from "./ClockEvents";

/**
 * Icon & list (`2`) with each day a card on the other surface instead of
 * between hairlines, the cards stacked: the same rows (`ClockEvents`), the
 * day's date at the top of its card, as Icon & list's (`ClockDate`), only
 * when there is more than one day. On a phone the cards are 350px at
 * most, centred.
 */
export function Variant({ values, language, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="clock" values={values} />
      {days.length > 0 ? (
        <ol className="mx-auto flex w-full max-w-[350px] flex-col gap-3 @3xl:mx-0 @3xl:max-w-none @3xl:gap-4">
          {days.map((day, index) => {
            const date = scheduleDay(day.values.date ?? "", language);
            const tone = clockTone(index);
            return (
              <li key={index} className={otherCard(ground)}>
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
