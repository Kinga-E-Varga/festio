"use client";

import { NUMBER_SIZE, useCountdown } from "@/modular/countdown";
import { text } from "@/modular/content";
import {
  CAPS,
  INNER_EYEBROW,
  MUTED,
  PAD_BOTTOM,
  PAD_X,
  SERIF,
  SECTION_GROUND,
  TONE_TEXT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";
import { NumberRow } from "./NumberRow";

/** The numbers' face, size and colour; the big-day line wears it too. */
const NUMBER = `${SERIF} ${NUMBER_SIZE} leading-none text-[color:var(--m-accent)]`;

/**
 * Days, hours, minutes and seconds to the start of the day, live, under
 * the eyebrow, set small (`INNER_EYEBROW`). It shares the date's band, so it has no top padding of
 * its own; on the accent band its ground turns every colour to the band's
 * ink. Until the first tick the numbers are dashes; on the day, and after
 * it, a fixed eyebrow and one line say so in their place. After a section
 * in two columns (`afterSplit`) it sits in the second (`JoinedColumn`), the
 * numbers spread across it.
 */
export function Variant({ values, basics, ground, afterSplit }: VariantProps) {
  const { left, done } = useCountdown(basics);

  return (
    <JoinedColumn
      afterSplit={afterSplit}
      className={`${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}
    >
      {done ? (
        <Done done={done} className={NUMBER} />
      ) : (
        <>
          {/* The eyebrow inside a section, as a location's label: smaller than a heading's. */}
          {text(values, "eyebrow") ? (
            <p className={`${INNER_EYEBROW} ${TONE_TEXT.secondary}`}>
              {text(values, "eyebrow")}
            </p>
          ) : null}
          <NumberRow
            left={left}
            number={NUMBER}
            unit={`${CAPS} ${MUTED} font-medium`}
            afterSplit={afterSplit}
          />
        </>
      )}
    </JoinedColumn>
  );
}
