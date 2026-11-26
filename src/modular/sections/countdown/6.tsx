"use client";

import { NUMBER_SIZE, useCountdown } from "@/modular/countdown";
import { CAPS, MUTED, SERIF } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ClockRow } from "./ClockRow";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";

/** The numbers' face, size and colour; the big-day line wears it too. */
const NUMBER = `${SERIF} ${NUMBER_SIZE} leading-none text-[color:var(--m-accent)]`;

/**
 * Clock: days, hours, minutes and seconds like a clock (`ClockRow`), the
 * numbers in the accent with colons between them in the muted ink at 30%.
 * It shares the date's band, as Simple joined does, so it has no top
 * padding of its own; after a section in two columns (`afterSplit`) it sits
 * in the second (`JoinedColumn`). No eyebrow, not even once the day has come.
 */
export function Variant({ basics, ground, afterSplit }: VariantProps) {
  const { left, done } = useCountdown(basics);

  return (
    <JoinedColumn afterSplit={afterSplit} ground={ground}>
      {done ? (
        <Done done={done} className={NUMBER} eyebrow={false} />
      ) : (
        <ClockRow
          left={left}
          number={NUMBER}
          colon={`${SERIF} ${NUMBER_SIZE} leading-none text-(--m-ink-muted)/30`}
          unit={`${CAPS} ${MUTED} font-medium`}
          afterSplit={afterSplit}
        />
      )}
    </JoinedColumn>
  );
}
