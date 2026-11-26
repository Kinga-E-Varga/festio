"use client";

import { useTranslations } from "next-intl";
import { pad } from "@/lib/event";
import { NUMBER_SIZE, UNITS, useCountdown } from "@/modular/countdown";
import type { TimeLeft } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import {
  ACCENT_FILL_CARD,
  CAPS,
  GROUND,
  HAIRLINE_FRAME,
  MUTED,
  PAD,
  SECTION_GROUND,
  SERIF,
} from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";

/** The numbers' face. */
const FACE = `${SERIF} leading-none`;

/** The big-day line: the numbers' face and size, in the ink. */
const CARD_NUMBER = `${FACE} ${NUMBER_SIZE} text-[color:var(--m-ink)]`;

/* In a split's second column, the small step at every width, so three-digit days keep room in their card. */
const NARROW_SIZE = "text-[34px]";

/**
 * Days, hours, minutes and seconds, each in a card on the other surface,
 * the number in the accent — two by two on a narrow column, in a row from
 * `@xl`. With `narrow` (in a split's second column) the cards share the
 * column's width, the numbers at 34px; otherwise they keep 156px each from `@3xl`. Until the
 * first tick the numbers are dashes. With `accent`, the cards on the
 * accent. Cards hard (`2`), Cards soft (`12`), Cards accent (`10`), Cards joined hard (`7`), Cards joined soft (`13`) and Cards
 * joined accent (`8`).
 */
export function CountdownCards({
  left,
  ground,
  narrow = false,
  accent = false,
  card = otherGround(ground),
}: {
  left: TimeLeft | null;
  ground: SectionGround;
  narrow?: boolean;
  /** The cards on the accent, everything in them in the accent's ink. */
  accent?: boolean;
  /** The cards' ground when not on the accent: the other surface from `ground` unless given. */
  card?: SectionGround;
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
          className={`flex flex-col items-center gap-2 ${accent ? ACCENT_FILL_CARD : `${HAIRLINE_FRAME} ${GROUND[card]}`} px-2 py-4 @3xl:py-6 ${narrow ? "" : "@3xl:min-w-39 @3xl:px-6"}`}
        >
          <span
            className={`${FACE} ${narrow ? NARROW_SIZE : NUMBER_SIZE} ${accent ? "text-[color:var(--m-ink)]" : "text-[color:var(--m-accent)]"} tabular-nums`}
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
 * Days, hours, minutes and seconds to the start of the day, live, each in
 * a card. A section of its own: it takes its turn of the grounds and its
 * full padding, no heading. On the day, and after it, a fixed eyebrow and
 * one line say so in their place. Cards hard (`2`, its `card` `surface-alt`), Cards soft (`12`, `surface`), and with `accent` the cards on the
 * accent: Cards accent (`10`).
 */
export function SectionCards({
  basics,
  ground,
  accent = false,
  card,
}: VariantProps & { accent?: boolean; card?: SectionGround }) {
  const { left, done } = useCountdown(basics);

  return (
    <div
      className={`flex flex-col items-center gap-7 ${SECTION_GROUND[ground]} ${PAD}`}
    >
      {done ? (
        <Done done={done} className={CARD_NUMBER} />
      ) : (
        <CountdownCards
          left={left}
          ground={ground}
          accent={accent}
          card={card}
        />
      )}
    </div>
  );
}

/**
 * Cards (`2`) in the date's band, as Simple joined (`3`): no top padding of
 * its own, no eyebrow; on the
 * accent band its ground turns every colour to the band's ink. After a
 * section in two columns (`afterSplit`) it sits in the second
 * (`JoinedColumn`), the cards sharing its width. Cards joined hard (`7`,
 * its `card` `surface-alt`), Cards joined soft (`13`, `surface`), and with
 * `accent` the cards on the accent: Cards joined accent (`8`).
 */
export function JoinedCards({
  basics,
  ground,
  afterSplit,
  accent = false,
  card,
}: VariantProps & { accent?: boolean; card?: SectionGround }) {
  const { left, done } = useCountdown(basics);

  return (
    <JoinedColumn afterSplit={afterSplit} ground={ground}>
      {done ? (
        <Done done={done} className={CARD_NUMBER} />
      ) : (
        <CountdownCards
          left={left}
          ground={ground}
          narrow={afterSplit}
          accent={accent}
          card={card}
        />
      )}
    </JoinedColumn>
  );
}
