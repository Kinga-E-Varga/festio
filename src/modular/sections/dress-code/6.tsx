import { DressCodeSwatches, hasSwatches } from "@/modular/cards/DressCodeCard";
import { FullCardNote } from "@/modular/cards/FullCardNote";
import { text } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import type { VariantProps } from "@/types/modular";

/**
 * On the accent band, the card's own fields as the section's heading: the
 * eyebrow, the title as the heading, the text as its note; no icon. The
 * colours under it, as in Full card accent (`5`), no card (`FullCardNote`).
 */
export function Variant({ values, ground }: VariantProps) {
  const heading = {
    eyebrow: text(values, "eyebrow"),
    heading: text(values, "title"),
    note: text(values, "body"),
  };

  return (
    <FullCardNote
      ground={ground}
      heading={<SectionHeading values={heading} />}
      eyebrow=""
      title=""
      body=""
    >
      {hasSwatches(values) ? <DressCodeSwatches values={values} /> : null}
    </FullCardNote>
  );
}
