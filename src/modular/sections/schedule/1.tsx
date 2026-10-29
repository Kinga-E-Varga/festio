import { groups } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { DayEvents } from "./DayEvents";

/**
 * The heading beside the days, each with its events (`DayEvents`), between
 * hairlines. No day is singled out. A single day shows no date.
 */
export function Variant({ values, language, ground }: VariantProps) {
  const days = groups(values, "days");

  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      {days.length > 0 ? (
        <ol className={`border-t-1 border-[var(--m-line)]`}>
          {days.map((day, index) => (
            <li
              key={index}
              className="border-b-1 border-[var(--m-line)] pt-4 pb-3"
            >
              <DayEvents
                day={day}
                index={index}
                showDate={days.length > 1}
                language={language}
              />
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
