import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SECTION_GROUND, STACK, TIMELINE_HEADING } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { TimelineDays } from "./Timeline";

/**
 * The full cards' heading, eyebrow and heading only, centred over the
 * timeline: one line down the middle from the first
 * stop to the last, on through the days, stopping only around a centred
 * date; each event's icon on a soft disc on it — a small dot where it has
 * none — and the events taking turns left and right, on across the days.
 * Each event its time as an eyebrow over its title and note; those on the
 * left lean on the line. The discs, the times and the line (at 50%) take turns by
 * day: the 1st, 3rd… in the accent, the 2nd, 4th… in the secondary. A day's
 * date in the muted ink stands above its events, only when there is more
 * than one day. On a phone the line runs down the left, every event and
 * date right of it, the whole no wider than 350px and centred. On the
 * accent (Accent, `10`) every disc in the palette's secondary.
 */
export function Variant({ values, language, ground }: VariantProps) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <div className={TIMELINE_HEADING}>
        <SectionHeading values={values} />
      </div>
      <TimelineDays
        values={values}
        language={language}
        accent={ground === "accent"}
      />
    </div>
  );
}
