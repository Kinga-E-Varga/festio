import { groups } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import {
  PAD,
  SPLIT,
  SECTION_GROUND,
  otherCard,
  NARROW_LIST,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { DayEvents } from "./DayEvents";

/**
 * Icon & list's (`2`) heading, the clock over it, beside the days, each a
 * card on the other surface, the cards stacked: the same cards as Two-line
 * & cards' (`6`, `DayEvents`, `centred`). On a phone the cards are 350px at
 * most, centred.
 */
export function Variant({ values, language, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="clock" values={values} />
      {days.length > 0 ? (
        <ol className={`${NARROW_LIST} flex flex-col gap-3 @3xl:gap-4`}>
          {days.map((day, index) => (
            <li key={index} className={otherCard(ground)}>
              <DayEvents
                day={day}
                index={index}
                showDate={days.length > 1}
                language={language}
                centred
              />
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
