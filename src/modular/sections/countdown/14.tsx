"use client";

import { NUMBER_SIZE, useCountdown } from "@/modular/countdown";
import { CAPS, MUTED, SERIF, STICKER } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { ClockRow } from "./ClockRow";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";

/** The numbers' face and size as stickers (`STICKER`). */
const FACE = `${SERIF} ${NUMBER_SIZE} ${STICKER.normal} leading-none`;

/** The numbers in the accent; the big-day line wears it too. */
const NUMBER = `${FACE} text-[color:var(--m-accent)]`;

/**
 * Clock sticker: Clock (`6`) as Sticker's stickers (`11`) — the
 * numbers, colons and units cut out of the pattern (`STICKER`). In the date's band, no top padding of
 * its own; on the accent band its ground turns every colour to the band's
 * ink. After a section in two columns (`afterSplit`) in the second
 * (`JoinedColumn`). No eyebrow.
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
          colon={`${FACE} text-(--m-ink-muted)/30`}
          unit={`${CAPS} ${MUTED} ${STICKER.medium}`}
          afterSplit={afterSplit}
        />
      )}
    </JoinedColumn>
  );
}
