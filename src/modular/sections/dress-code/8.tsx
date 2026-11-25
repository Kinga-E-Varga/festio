import { DressCodeSwatches, hasSwatches } from "@/modular/cards/DressCodeCard";
import { FullCardNote } from "@/modular/cards/FullCardNote";
import { text } from "@/modular/content";
import { twinIcon } from "@/modular/notes";
import type { VariantProps } from "@/types/modular";

/**
 * Accent (`6`) on the page's surface, in its turn: the section's heading,
 * then the card's icon on its soft disc in the accent, its own label, the
 * title and text, and the colours under them, no card (`FullCardNote`).
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <FullCardNote
      ground={ground}
      values={values}
      band
      icon={twinIcon(values)}
      label={text(values, "label")}
      title={text(values, "title")}
      body={text(values, "body")}
    >
      {hasSwatches(values) ? <DressCodeSwatches values={values} /> : null}
    </FullCardNote>
  );
}
