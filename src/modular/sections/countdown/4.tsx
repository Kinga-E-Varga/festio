"use client";

import { NUMBER_SIZE, useCountdown } from "@/modular/countdown";
import { SERIF, MUTED } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";
import { Sentence, SENTENCE_NUMBER } from "./Sentence";

/** The big-day line's face, size and colour. */
const NUMBER = `${SERIF} ${NUMBER_SIZE} leading-none ${MUTED}`;

/**
 * Sentence: the time left written out as one line (`Sentence`), the words
 * and the closing line in the muted ink, the numbers in the accent. It
 * shares the date's band, as Simple joined does, so it has no top padding
 * of its own. No eyebrow, not even once the day has come. After a section
 * in two columns (`afterSplit`) it sits in the second (`JoinedColumn`).
 */
export function Variant({ basics, ground, afterSplit }: VariantProps) {
  const { left, done } = useCountdown(basics);

  return (
    <JoinedColumn afterSplit={afterSplit} ground={ground}>
      {done ? (
        <Done done={done} className={NUMBER} eyebrow={false} />
      ) : (
        <Sentence left={left} words={MUTED} number={SENTENCE_NUMBER} />
      )}
    </JoinedColumn>
  );
}
