"use client";

import { NUMBER_SIZE, useCountdown } from "@/modular/countdown";
import { SERIF, MUTED, STICKER } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";
import { Sentence, SENTENCE_NUMBER } from "./Sentence";

/** The big-day line as a sticker, in the muted ink. */
const NUMBER = `${SERIF} ${NUMBER_SIZE} ${STICKER.normal} leading-none ${MUTED}`;

/**
 * Sentence sticker: Sentence (`4`) as Sticker's stickers (`11`) — the
 * numbers and the words cut out of the pattern (`STICKER`). In the date's band, no top padding of its own; on the
 * accent band its ground turns every colour to the band's ink. After a
 * section in two columns (`afterSplit`) in the second (`JoinedColumn`). No
 * eyebrow.
 */
export function Variant({ basics, ground, afterSplit }: VariantProps) {
  const { left, done } = useCountdown(basics);

  return (
    <JoinedColumn afterSplit={afterSplit} ground={ground}>
      {done ? (
        <Done done={done} className={NUMBER} eyebrow={false} />
      ) : (
        <Sentence
          left={left}
          words={`${MUTED} ${STICKER.semibold}`}
          number={`${SENTENCE_NUMBER} ${STICKER.normal}`}
        />
      )}
    </JoinedColumn>
  );
}
