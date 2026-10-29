"use client";

import { useTranslations } from "next-intl";
import { NUMBER_SIZE, useCountdown } from "@/modular/countdown";
import {
  EYEBROW,
  HEADING,
  PAD_BOTTOM,
  PAD_X,
  SERIF,
  SECTION_GROUND,
  MUTED,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";

/** The big-day line's face, size and colour. */
const NUMBER = `${SERIF} ${NUMBER_SIZE} leading-none ${MUTED}`;

/**
 * The time left written out as one line ("Only 68 days, 8 hours… to go."),
 * the words as an eyebrow (`EYEBROW`) and the closing line in the muted
 * ink, the numbers a 34px serif heading, in the accent. It shares
 * the date's band, as Simple joined does, so it has no top padding of its own. No
 * eyebrow, not even once the day has come. Until the first tick the
 * numbers are dashes. After a section in two columns (`afterSplit`) it sits
 * in the second (`JoinedColumn`).
 */
export function Variant({ basics, ground, afterSplit }: VariantProps) {
  const t = useTranslations("Sections");
  const { left, done } = useCountdown(basics);

  return (
    <JoinedColumn
      afterSplit={afterSplit}
      className={`${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}
    >
      {done ? (
        <Done done={done} className={NUMBER} eyebrow={false} />
      ) : (
        <p
          role="timer"
          aria-label={
            left ? t("countdownLabel", { count: left.days }) : undefined
          }
          className={`${EYEBROW} ${MUTED} max-w-2xl text-center text-balance`}
        >
          {t.rich("countdownSentence", {
            days: left?.days ?? 0,
            hours: left?.hours ?? 0,
            minutes: left?.minutes ?? 0,
            seconds: left?.seconds ?? 0,
            n: (chunks) => (
              <span
                aria-hidden="true"
                className={`${HEADING} text-[34px] leading-[1.1] tracking-[-0.03em] text-[color:var(--m-accent)] tabular-nums`}
              >
                {left ? chunks : "––"}
              </span>
            ),
          })}
        </p>
      )}
    </JoinedColumn>
  );
}
