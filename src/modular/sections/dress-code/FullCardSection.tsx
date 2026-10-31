import { text } from "@/modular/content";
import { DressCodeSwatches, hasSwatches } from "@/modular/cards/DressCodeCard";
import { FullCardNote } from "@/modular/cards/FullCardNote";
import { twinIcon } from "@/modular/notes";
import type { VariantProps } from "@/types/modular";

/** The section in one card: its heading, then the icon, title, text and colours (`FullCardNote`): Full card (`4`); with `accent`, on the accent, Full card accent (`5`). */
export function FullCardSection({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  return (
    <FullCardNote
      ground={ground}
      accent={accent}
      values={values}
      icon={twinIcon(values)}
      title={text(values, "title")}
      body={text(values, "body")}
    >
      {hasSwatches(values) ? <DressCodeSwatches values={values} /> : null}
    </FullCardNote>
  );
}
