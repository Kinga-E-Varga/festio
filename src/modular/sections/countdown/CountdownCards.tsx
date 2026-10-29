"use client";

import { useTranslations } from "next-intl";
import { pad } from "@/lib/event";
import { NUMBER_SIZE, UNITS, useCountdown } from "@/modular/countdown";
import { text, type TimeLeft } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import {
  ACCENT_FILL_CARD,
  CAPS,
  GROUND,
  HAIRLINE_FRAME,
  INNER_EYEBROW,
  MUTED,
  PAD_BOTTOM,
  PAD_X,
  SECTION_GROUND,
  SERIF,
  TONE_TEXT,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";

/** The numbers' face and colour. */
const FACE = `${SERIF} leading-none text-[color:var(--m-ink)]`;

/** The numbers' face, size and colour; the big-day line wears it too. */
export const CARD_NUMBER = `${FACE} ${NUMBER_SIZE}`;

/* In a split's second column, the small step at every width, so three-digit days keep room in their card. */
const NARROW_NUMBER = `${FACE} text-[34px]`;

/**
 * Days, hours, minutes and seconds, each in a card on the other surface,
 * the number in the ink — two by two on a narrow column, in a row from
 * `@xl`. With `narrow` (in a split's second column) the cards share the
 * column's width, the numbers at 34px; otherwise they keep 156px each from `@3xl`. Until the
 * first tick the numbers are dashes. With `accent`, the cards on the
 * accent. Cards (`2`), Cards joined (`7`) and Cards joined accent (`8`).
 */
export function CountdownCards({
  left,
  ground,
  narrow = false,
  accent = false,
}: {
  left: TimeLeft | null;
  ground: SectionGround;
  narrow?: boolean;
  /** The cards on the accent, everything in them in the accent's ink. */
  accent?: boolean;
}) {
  const t = useTranslations("Sections");

  return (
    <div
      role="timer"
      aria-label={left ? t("countdownLabel", { count: left.days }) : undefined}
      className={`grid w-full grid-cols-2 gap-2.5 @xl:grid-cols-4 @3xl:gap-4 ${narrow ? "" : "max-w-sm @xl:max-w-xl @3xl:w-auto @3xl:max-w-none"}`}
    >
      {UNITS.map((unit) => (
        <div
          key={unit}
          aria-hidden="true"
          className={`flex flex-col items-center gap-2 ${accent ? ACCENT_FILL_CARD : `${HAIRLINE_FRAME} ${GROUND[otherGround(ground)]}`} px-2 py-4 @3xl:py-6 ${narrow ? "" : "@3xl:min-w-39 @3xl:px-6"}`}
        >
          <span
            className={`${narrow ? NARROW_NUMBER : CARD_NUMBER} tabular-nums`}
          >
            {left ? pad(left[unit]) : "––"}
          </span>
          <span className={`${CAPS} ${MUTED} font-medium`}>
            {t(unit, { count: left?.[unit] ?? 0 })}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Cards (`2`) in the date's band, as Simple joined (`3`): no top padding of
 * its own, the eyebrow set small (`INNER_EYEBROW`) over the cards; on the
 * accent band its ground turns every colour to the band's ink, the cards on
 * the page's surface. After a section in two columns (`afterSplit`) it sits
 * in the second (`JoinedColumn`), the cards sharing its width. Cards joined
 * (`7`), and with `accent` the cards on the accent: Cards joined accent
 * (`8`).
 */
export function JoinedCards({
  values,
  basics,
  ground,
  afterSplit,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const { left, done } = useCountdown(basics);

  return (
    <JoinedColumn
      afterSplit={afterSplit}
      className={`${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}
    >
      {done ? (
        <Done done={done} className={CARD_NUMBER} />
      ) : (
        <>
          {text(values, "eyebrow") ? (
            <p className={`${INNER_EYEBROW} ${TONE_TEXT.secondary}`}>
              {text(values, "eyebrow")}
            </p>
          ) : null}
          <CountdownCards
            left={left}
            ground={ground}
            narrow={afterSplit}
            accent={accent}
          />
        </>
      )}
    </JoinedColumn>
  );
}
