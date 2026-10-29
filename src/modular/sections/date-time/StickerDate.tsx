import { formatInvitationDate } from "@/lib/invitation";
import { text } from "@/modular/content";
import { BAND_LINE, PAD, SECTION_GROUND, STICKER_TEXT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/** Each sticker's colour: the ink, or the accent. */
const INKS = {
  simple: "text-[color:var(--m-ink)]",
  colorful: "text-[color:var(--m-accent)]",
};

/**
 * The date alone, set as Simple accent's (`BAND_LINE`) but as the title's
 * stickers: medium, cut out of a pattern (`STICKER_TEXT`), in the format
 * the host picked.
 */
export function StickerDate({
  values,
  basics,
  language,
  ground,
  look,
}: VariantProps & { look: keyof typeof INKS }) {
  return (
    <div
      className={`flex flex-col items-center ${SECTION_GROUND[ground]} text-center ${PAD}`}
    >
      <time
        dateTime={basics.date}
        className={`${BAND_LINE} ${STICKER_TEXT} ${INKS[look]} max-w-4xl`}
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
