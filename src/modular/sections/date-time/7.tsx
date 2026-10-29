import { formatInvitationDate } from "@/lib/invitation";
import { text } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { BAND_LINE, PAD, SECTION_GROUND, STACK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Heading & date box without the box: the section's heading centred, the
 * eyebrow over it and the note under it, and the date centred under them,
 * set as the band's date (`BAND_LINE`) in the accent, in the format the host
 * picked.
 */
export function Variant({ values, basics, language, ground }: VariantProps) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <time
        dateTime={basics.date}
        className={`${BAND_LINE} text-center text-[color:var(--m-accent)]`}
      >
        {formatInvitationDate(
          basics.date,
          text(values, "dateFormat"),
          language,
        )}
      </time>
    </div>
  );
}
