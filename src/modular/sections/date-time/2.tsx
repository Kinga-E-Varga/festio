import { formatInvitationDate } from "@/lib/invitation";
import { text } from "@/modular/content";
import { BAND_LINE, GROUND, LEAD, PAD_SNUG } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * The date large on an accent band, set like the Plain title's names but
 * smaller, in the format the host picked, and the heading's note under
 * it. No heading.
 */
export function Variant({ values, basics, language, ground }: VariantProps) {
  const note = text(values, "note");

  return (
    <div
      className={`flex flex-col items-center ${GROUND[ground]} text-center ${PAD_SNUG}`}
    >
      <time dateTime={basics.date} className={`${BAND_LINE} max-w-4xl`}>
        {formatInvitationDate(
          basics.date,
          text(values, "dateFormat"),
          language,
        )}
      </time>
      {note ? <p className={`${LEAD} mt-6 max-w-xl`}>{note}</p> : null}
    </div>
  );
}
