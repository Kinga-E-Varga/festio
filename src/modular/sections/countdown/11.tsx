"use client";

import { NUMBER_SIZE, useCountdown } from "@/modular/countdown";
import {
  CAPS,
  MUTED,
  PAD_BOTTOM,
  PAD_X,
  SERIF,
  SECTION_GROUND,
  SMALL_STICKER,
  STICKER_TEXT,
  TEXT_CUT_THICK,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { JoinedColumn } from "./JoinedColumn";
import { NumberRow } from "./NumberRow";

/**
 * The numbers as the Text box's stickers, in the accent as Clock joined's:
 * medium, an outline in the surface round each figure, a little thicker
 * (`TEXT_CUT_THICK`), shown with a pattern on; the big-day line wears it too.
 */
const NUMBER = `${SERIF} ${NUMBER_SIZE} ${STICKER_TEXT} ${TEXT_CUT_THICK} leading-none text-[color:var(--m-accent)]`;

/**
 * Simple joined (`3`) as stickers, no eyebrow: the numbers as above, their
 * units bold with a thicker outline (`SMALL_STICKER`). In the date's band,
 * no top padding of its own; on the accent band its ground turns every
 * colour to the band's ink. After a section in two columns (`afterSplit`)
 * in the second (`JoinedColumn`).
 */
export function Variant({ basics, ground, afterSplit }: VariantProps) {
  const { left, done } = useCountdown(basics);

  return (
    <JoinedColumn
      afterSplit={afterSplit}
      className={`${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}
    >
      {done ? (
        <Done done={done} className={NUMBER} eyebrow={false} />
      ) : (
        <NumberRow
          left={left}
          number={NUMBER}
          unit={`${CAPS} ${MUTED} ${SMALL_STICKER}`}
          afterSplit={afterSplit}
        />
      )}
    </JoinedColumn>
  );
}
