import { formatInvitationDate } from "@/lib/invitation";
import { text } from "@/modular/content";
import { BAND_LINE, PAD, SECTION_GROUND, STICKER } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Sticker: the date alone, set as Simple accent's (`BAND_LINE`) but as the
 * title's stickers: cut out of a pattern (`STICKER`), in the accent, in the
 * format the host picked.
 */
export function Variant({ values, basics, language, ground }: VariantProps) {
  return (
    <div
      className={`flex flex-col items-center ${SECTION_GROUND[ground]} text-center ${PAD}`}
    >
      <time
        dateTime={basics.date}
        className={`${BAND_LINE} ${STICKER.normal} text-[color:var(--m-accent)] max-w-4xl`}
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
