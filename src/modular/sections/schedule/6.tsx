import { groups } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  PAD,
  SPLIT,
  SECTION_GROUND,
  otherCard,
  CARD_STACK,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { DayEvents } from "./DayEvents";

/**
 * Two-line & list (`1`) with each day a card on the other surface instead
 * of between hairlines, the cards stacked: each event centred in its card,
 * no icons (`DayEvents`, `centred`), the day's date over them. A single day
 * shows no date.
 */
export function Variant({ values, language, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      {days.length > 0 ? (
        <ol className={CARD_STACK}>
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
