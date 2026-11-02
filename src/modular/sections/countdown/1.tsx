"use client";

import { NUMBER_SIZE, useCountdown } from "@/modular/countdown";
import { SectionHeading } from "@/modular/SectionHeading";
import { CAPS, MUTED, PAD, SERIF, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Done } from "./Done";
import { NumberRow } from "./NumberRow";

/** The numbers' face, size and colour; the big-day line wears it too. */
const NUMBER = `${SERIF} ${NUMBER_SIZE} leading-none text-[color:var(--m-ink)]`;

/**
 * Days, hours, minutes and seconds to the start of the day, live, the
 * numbers in the ink, shared by Simple (`1`) and Simple accent (`9`). A
 * section of its own: its full padding, on the ground the page gives it
 * (on the accent, every colour the accent's ink). Until the first tick the numbers are
 * dashes; on the day, and after it, a fixed eyebrow and one line say so in
 * their place.
 */
export function Variant({ values, basics, ground }: VariantProps) {
  const { left, done } = useCountdown(basics);

  return (
    <div
      className={`flex flex-col items-center gap-7 ${SECTION_GROUND[ground]} ${PAD}`}
    >
      {done ? (
        <Done done={done} className={NUMBER} />
      ) : (
        <>
          <SectionHeading values={values} />
          <NumberRow
            left={left}
            number={NUMBER}
            unit={`${CAPS} ${MUTED} font-medium`}
          />
        </>
      )}
    </div>
  );
}
