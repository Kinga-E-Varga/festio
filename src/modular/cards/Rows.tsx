import type { ReactNode } from "react";
import { CARD_STACK, NARROW_LIST, otherCard } from "@/modular/styles";
import type { SectionGround } from "@/types/modular";

/**
 * Items as rows between hairlines, 16px over a row's content and 12px
 * under it, or with `cards` each a card on the other surface from that
 * ground, stacked (`CARD_STACK`). `narrow`: the rows 350px at most on a
 * phone (`NARROW_LIST`). Transportation's Two-line rows, Special people's
 * and Contact's lists. Nothing without items.
 */
export function Rows<T>({
  items,
  cards,
  narrow = false,
  children,
}: {
  items: T[];
  /** The section's ground: each item a card on the other surface. */
  cards?: SectionGround;
  narrow?: boolean;
  children: (item: T, index: number) => ReactNode;
}) {
  if (items.length === 0) return null;

  return (
    <ul
      className={
        cards
          ? CARD_STACK
          : `border-t-1 border-[var(--m-line)] ${narrow ? NARROW_LIST : ""}`
      }
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={
            cards
              ? otherCard(cards)
              : "border-b-1 border-[var(--m-line)] pt-4 pb-3"
          }
        >
          {children(item, index)}
        </li>
      ))}
    </ul>
  );
}
