import { dayOfMonth, monthName, weekday, yearOf } from "@/modular/content";
import {
  CARD,
  GROUND,
  H3,
  NAMES_SIZE,
  SERIF,
  TONE_TEXT,
} from "@/modular/styles";
import type { Language } from "@/lib/language";
import type { SectionGround } from "@/types/modular";

/** The lines over and under the day: a card's heading, but in the accent. */
const SIDE = `${H3} text-[color:var(--m-accent)]!`;

/**
 * The date in a card on `ground`, shaped as Transportation's: the month, the
 * day, then the weekday and the year, one to a row. The day at the title's
 * names' size, the lines either side as a card's heading (`H3`) in the
 * accent, the day in the secondary: on the accent card both read as the
 * accent's ink (`ON_ACCENT`). The card fills its column, as tall as the
 * heading beside it, the date centred in it.
 */
export function DateBox({
  date,
  language,
  ground,
}: {
  date: string;
  language: Language;
  ground: SectionGround;
}) {
  return (
    <time
      dateTime={date}
      className={`${CARD} ${GROUND[ground]} flex w-full items-center justify-center self-stretch text-center`}
    >
      {/* Its own span: the card's ground sets the ink, the secondary wins here. */}
      <span
        className={`${SERIF} flex flex-col gap-3 capitalize ${TONE_TEXT.secondary}`}
      >
        <span className={SIDE}>{monthName(date, language)}</span>
        <span className={`${NAMES_SIZE} leading-none`}>{dayOfMonth(date)}</span>
        <span className={SIDE}>
          {weekday(date, language)} · {yearOf(date)}
        </span>
      </span>
    </time>
  );
}
