import { Icon } from "@/modular/icons";
import {
  BODY,
  CORNER,
  GROUND,
  H4,
  ITEM_TITLE,
  MEASURE,
  MUTED,
} from "@/modular/styles";
import type { Ground, ListItem } from "@/types/modular";

/**
 * The questions, each opening to its answer. Shared by Split and
 * Simple, which passes `box`: each question a bar of its own on that
 * surface, with a gap between, in place of the rows between hairlines.
 * `columns`: the bars two side by side from `@3xl`, each opening on its
 * own, its neighbour keeping its height. `ask`: one more bar last, in the
 * secondary, its words a link to the reply form. `divided`: the rows with a
 * line only between them, for a full card, whose own lines close the list;
 * `ask` then one more row last, as the bar.
 */
export function FaqList({
  items,
  box,
  columns = false,
  ask = "",
  divided = false,
}: {
  items: ListItem[];
  box?: Ground;
  columns?: boolean;
  ask?: string;
  divided?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div
      className={
        box
          ? columns
            ? "grid items-start gap-3 @3xl:grid-cols-2"
            : "flex flex-col gap-3"
          : divided
            ? "divide-y-1 divide-[var(--m-line)]"
            : "border-t-1 border-[var(--m-line)]"
      }
    >
      {items.map((item, index) => (
        <details
          key={index}
          className={`group ${box ? `${BAR} ${GROUND[box]}` : divided ? "" : "border-b-1 border-[var(--m-line)]"}`}
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
      {(box || divided) && ask ? (
        <a
          href="#rsvp"
          className={`${box ? `${BAR} ${GROUND[box]}` : ""} ${H4} flex min-h-16 items-center justify-between gap-5 py-3 text-[color:var(--m-secondary)]!`}
        >
          {ask}
          <Icon name="arrow-up-right" className="size-4 shrink-0" />
        </a>
      ) : null}
    </div>
  );
}

/** A question's bar: a hairline frame with the corners step. Its surface is the caller's. */
const BAR = `${CORNER} border-1 border-[var(--m-line)] px-5 @3xl:px-6`;
