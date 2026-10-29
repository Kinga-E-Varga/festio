"use client";

import { useCountdown } from "@/modular/countdown";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CARD_NUMBER, CountdownCards } from "./CountdownCards";
import { Done } from "./Done";

/**
 * Days, hours, minutes and seconds to the start of the day, live, each in
 * a card (`CountdownCards`). A section of its own: it takes its turn of the
 * grounds and its full padding. On the day, and after it, a fixed eyebrow
 * and one line say so in their place.
 */
export function Variant({ values, basics, ground }: VariantProps) {
  const { left, done } = useCountdown(basics);

  return (
    <div
      className={`flex flex-col items-center gap-7 ${SECTION_GROUND[ground]} ${PAD}`}
    >
      {done ? (
        <Done done={done} className={CARD_NUMBER} />
      ) : (
        <>
          <SectionHeading values={values} />
          <CountdownCards left={left} ground={ground} />
        </>
      )}
    </div>
  );
}
