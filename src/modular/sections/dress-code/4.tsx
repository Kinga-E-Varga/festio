import { text } from "@/modular/content";
import { DressCodeSwatches, hasSwatches } from "@/modular/cards/DressCodeCard";
import { FullCardNote } from "@/modular/cards/FullCardNote";
import { twinIcon } from "@/modular/notes";
import type { VariantProps } from "@/types/modular";

/** The full card alone, the icon, intro line, title, text and colours in it (`FullCardNote`). */
export function Variant({ values, ground }: VariantProps) {
  return (
    <FullCardNote
      ground={ground}
      icon={twinIcon(values)}
      eyebrow={text(values, "eyebrow")}
      title={text(values, "title")}
      body={text(values, "body")}
    >
      {hasSwatches(values) ? <DressCodeSwatches values={values} /> : null}
    </FullCardNote>
  );
}
