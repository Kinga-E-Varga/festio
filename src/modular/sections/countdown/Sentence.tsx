"use client";

import { useTranslations } from "next-intl";
import type { useCountdown } from "@/modular/countdown";
import { EYEBROW, HEADING } from "@/modular/styles";

/** The numbers' face: a 34px serif heading, in the accent. */
export const SENTENCE_NUMBER = `${HEADING} text-[34px] leading-[1.1] tracking-[-0.03em] text-[color:var(--m-accent)]`;

/**
 * The time left written out as one line ("Only 68 days, 8 hours… to go."),
 * the words as an eyebrow (`EYEBROW`), centred. Dashes until the first
 * tick. Sentence (`4`) and Sentence sticker (`15`); their looks in `words`
 * (over the eyebrow) and `number`.
 */
export function Sentence({
  left,
  words,
  number,
}: {
  left: ReturnType<typeof useCountdown>["left"];
  words: string;
  number: string;
}) {
  const t = useTranslations("Sections");

  return (
    <p
      role="timer"
      aria-label={left ? t("countdownLabel", { count: left.days }) : undefined}
      className={`${EYEBROW} ${words} max-w-2xl text-center text-balance`}
    >
      {t.rich("countdownSentence", {
        days: left?.days ?? 0,
        hours: left?.hours ?? 0,
        minutes: left?.minutes ?? 0,
        seconds: left?.seconds ?? 0,
        n: (chunks) => (
          <span aria-hidden="true" className={`${number} tabular-nums`}>
            {left ? chunks : "––"}
          </span>
        ),
      })}
    </p>
  );
}
