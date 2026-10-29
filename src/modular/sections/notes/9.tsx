import { list } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import { noteItems } from "@/modular/notes";
import type { VariantProps } from "@/types/modular";
import { NoteTiles } from "./NoteTiles";

/**
 * Transportation's Full card & list for the notes: the heading centred,
 * the notes under it between the card's lines (`FullCard`), one under
 * another, a line across between each, each centred as a Cards (`8`)
 * card's content (`NoteTiles`).
 */
export function Variant({ values, related, ground }: VariantProps) {
  const items = noteItems(list(values, "items"), values);
  if (items.length === 0) return null;

  return (
    <FullCard values={values} ground={ground}>
      <NoteTiles items={items} related={related} ground={ground} look="list" />
    </FullCard>
  );
}
