import { Icon } from "@/modular/icons";
import {
  BODY,
  CORNER,
  GROUND,
  ITEM_TITLE,
  MEASURE,
  MUTED,
} from "@/modular/styles";
import type { Ground, ListItem } from "@/types/modular";

/**
 * The questions, each opening to its answer. Shared by Split and
 * Simple, which passes `box`: each question a bar of its own on that
 * surface, with a gap between, in place of the rows between hairlines.
 */
export function FaqList({ items, box }: { items: ListItem[]; box?: Ground }) {
  if (items.length === 0) return null;
  return (
    <div
      className={
        box ? "flex flex-col gap-3" : "border-t-1 border-[var(--m-line)]"
      }
    >
      {items.map((item, index) => (
        <details
          key={index}
          className={`group ${box ? `${CORNER} border-1 border-[var(--m-line)] px-5 @3xl:px-6 ${GROUND[box]}` : "border-b-1 border-[var(--m-line)]"}`}
        >
          <summary
            className={`${ITEM_TITLE} flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-3 [&::-webkit-details-marker]:hidden`}
          >
            {item.question}
            <Icon
              name="chevron-down"
              className="size-4 shrink-0 text-[color:var(--m-secondary)] transition-transform group-open:rotate-180"
            />
          </summary>
          <p
            className={`${BODY} ${MUTED} ${MEASURE} mb-5 pr-9 whitespace-pre-line`}
          >
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
