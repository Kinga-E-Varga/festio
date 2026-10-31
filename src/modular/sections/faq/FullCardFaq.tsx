import { list, text } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { FaqList } from "./FaqList";

/**
 * Accommodation's Full card (`7`) for the questions: the heading
 * centred, the questions under it between the card's lines as plain rows,
 * a line between each, no icons (`FaqList`, `divided`); the link to the
 * reply form the last row, in the secondary. Every answer starts closed.
 * Full card (`6`); with `accent`, the card on the accent and no lines at
 * all: Full card accent (`7`).
 */
export function FullCardFaq({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const items = list(values, "items");
  if (items.length === 0) return null;

  return (
    <FullCard values={values} ground={ground} accent={accent}>
      <FaqList
        items={items}
        divided
        lines={!accent}
        ask={text(values, "linkLabel")}
      />
    </FullCard>
  );
}
