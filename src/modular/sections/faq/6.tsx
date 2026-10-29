import { list, text } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { FaqList } from "./FaqList";

/**
 * Accommodation's Full card & list (`7`) for the questions: the heading
 * centred, the questions under it between the card's lines as plain rows,
 * a line between each, no icons (`FaqList`, `divided`); the link to the
 * reply form the last row, in the secondary. Every answer starts closed.
 */
export function Variant({ values, ground }: VariantProps) {
  const items = list(values, "items");
  if (items.length === 0) return null;

  return (
    <FullCard values={values} ground={ground}>
      <FaqList items={items} divided ask={text(values, "linkLabel")} />
    </FullCard>
  );
}
