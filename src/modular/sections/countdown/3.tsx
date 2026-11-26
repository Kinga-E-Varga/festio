"use client";

import { NUMBER_SIZE, useCountdown } from "@/modular/countdown";
import { CAPS, MUTED, SERIF } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";
import { NumberRow } from "./NumberRow";

/** The numbers' face, size and colour; the big-day line wears it too. */
const NUMBER = `${SERIF} ${NUMBER_SIZE} leading-none text-[color:var(--m-accent)]`;

/**
 * Days, hours, minutes and seconds to the start of the day, live, no
 * eyebrow. It shares the date's band, so it has no top padding of its own;
 * on the accent band its ground turns every colour to the band's ink. Until
 * the first tick the numbers are dashes; on the day, and after it, one line
 * says so in their place. After a section in two columns (`afterSplit`) it
 * sits in the second (`JoinedColumn`), the numbers spread across it.
 */
export function Variant({ basics, ground, afterSplit }: VariantProps) {
  const { left, done } = useCountdown(basics);

  return (
    <JoinedColumn afterSplit={afterSplit} ground={ground}>
      {done ? (
        <Done done={done} className={NUMBER} eyebrow={false} />
      ) : (
        <NumberRow
          left={left}
          number={NUMBER}
          unit={`${CAPS} ${MUTED} font-medium`}
          afterSplit={afterSplit}
        />
      )}
    </JoinedColumn>
  );
}
