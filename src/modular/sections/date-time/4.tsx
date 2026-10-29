import { formatInvitationDate } from "@/lib/invitation";
import { text } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  ACCENT_FILL_CARD,
  BAND_LINE,
  COLUMN,
  PAD,
  SECTION_GROUND,
  STACK,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The section's heading centred, the eyebrow over it and the note under
 * it, and the date centred under them in an accent box, no hairline
 * (`ACCENT_FILL_CARD`), the invitation's corners, 960px at most (`COLUMN`), in the
 * accent's ink, set as `BAND_LINE`, in the format the host picked.
 */
export function Variant({ values, basics, language, ground }: VariantProps) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <time
        dateTime={basics.date}
        className={`${BAND_LINE} ${COLUMN} ${ACCENT_FILL_CARD} px-6 py-6 text-center leading-[1.2]! text-[color:var(--m-accent)] @3xl:px-8 @3xl:py-8`}
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
