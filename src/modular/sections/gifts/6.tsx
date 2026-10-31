import { GiftActions, hasGiftActions } from "@/modular/cards/GiftsCard";
import { FullCardNote } from "@/modular/cards/FullCardNote";
import { text } from "@/modular/content";
import { twinIcon } from "@/modular/notes";
import type { VariantProps } from "@/types/modular";

/**
 * On the accent band, the section's heading, then the card's icon on the
 * palette's secondary disc, its own label under it (as a Helpful notes
 * tile's), the title and text, and the gift
 * buttons under them, as in Full card accent (`5`), no card
 * (`FullCardNote`).
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <FullCardNote
      ground={ground}
      values={values}
      band
      accent
      icon={twinIcon(values)}
      label={text(values, "label")}
      title={text(values, "title")}
      body={text(values, "body")}
    >
      {hasGiftActions(values) ? <GiftActions values={values} accent /> : null}
    </FullCardNote>
  );
}
