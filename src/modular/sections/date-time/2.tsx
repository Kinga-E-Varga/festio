import { shortWeekdayDate, text } from "@/modular/content";
import { DISPLAY_PLAIN, GROUND, LEAD, PAD_SNUG } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The date large on an accent band, set like the Plain title's names but
 * smaller, and under it the heading's note: how the day goes, in the host's
 * own words. No heading and no parts of the day.
 */
export function Variant({ values, basics, language, ground }: VariantProps) {
  const note = text(values, "note");

  return (
    <div
      className={`flex flex-col items-center ${GROUND[ground]} text-center ${PAD_SNUG}`}
    >
      <time
        dateTime={basics.date}
        className={`${DISPLAY_PLAIN} max-w-4xl text-[40px] @md:text-[48px] @3xl:text-[60px] @5xl:text-[68px]`}
      >
        {shortWeekdayDate(basics.date, language)}
      </time>
      {note ? (
        <p
          className={`${LEAD} mt-6 max-w-160 text-balance whitespace-pre-line`}
        >
          {note}
        </p>
      ) : null}
    </div>
  );
}
