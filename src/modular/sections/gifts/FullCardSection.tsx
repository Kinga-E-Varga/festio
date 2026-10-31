import { text } from "@/modular/content";
import { GiftActions, hasGiftActions } from "@/modular/cards/GiftsCard";
import { FullCardNote } from "@/modular/cards/FullCardNote";
import { twinIcon } from "@/modular/notes";
import type { VariantProps } from "@/types/modular";

/** The full card alone, the icon, intro line, title, text and gift buttons in it (`FullCardNote`): Full card (`4`); with `accent`, on the accent, Full card accent (`5`). */
export function FullCardSection({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  return (
    <FullCardNote
      ground={ground}
      accent={accent}
      icon={twinIcon(values)}
      eyebrow={text(values, "eyebrow")}
      title={text(values, "title")}
      body={text(values, "body")}
    >
      {hasGiftActions(values) ? (
        <GiftActions values={values} accent={accent} />
      ) : null}
    </FullCardNote>
  );
}
