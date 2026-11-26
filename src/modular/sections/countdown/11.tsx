"use client";

import { NUMBER_SIZE, useCountdown } from "@/modular/countdown";
import { CAPS, MUTED, SERIF, STICKER } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";
import { NumberRow } from "./NumberRow";

/**
 * The numbers as the Text box's stickers, in the accent as Clock's:
 * cut out of a pattern (`STICKER`); the big-day line wears it too.
 */
const NUMBER = `${SERIF} ${NUMBER_SIZE} ${STICKER.normal} leading-none text-[color:var(--m-accent)]`;

/**
 * Simple joined (`3`) as stickers, no eyebrow: the numbers as above, their
 * units stickers too (`STICKER`). In the date's band,
 * no top padding of its own; on the accent band its ground turns every
 * colour to the band's ink. After a section in two columns (`afterSplit`)
 * in the second (`JoinedColumn`).
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
          unit={`${CAPS} ${MUTED} ${STICKER.medium}`}
          afterSplit={afterSplit}
        />
      )}
    </JoinedColumn>
  );
}
