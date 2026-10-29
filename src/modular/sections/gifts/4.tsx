import { text } from "@/modular/content";
import { GiftActions, hasGiftActions } from "@/modular/cards/GiftsCard";
import { FullCardNote } from "@/modular/cards/FullCardNote";
import { twinIcon } from "@/modular/notes";
import type { VariantProps } from "@/types/modular";

/** The full card alone, the icon, intro line, title, text and gift buttons in it (`FullCardNote`). */
export function Variant({ values, ground }: VariantProps) {
  return (
    <FullCardNote
      ground={ground}
      icon={twinIcon(values)}
      eyebrow={text(values, "eyebrow")}
      title={text(values, "title")}
      body={text(values, "body")}
    >
      {hasGiftActions(values) ? <GiftActions values={values} /> : null}
    </FullCardNote>
  );
}
