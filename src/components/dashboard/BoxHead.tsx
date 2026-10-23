import type { ReactNode } from "react";

/**
 * A box's head: its serif title, how many things it holds right after it,
 * a line under it, and what belongs at its far right. The space under it is
 * the box's padding (`BOX_PAD`), the space over it; whatever sits beside the
 * title is pulled in over and under (`-my-2`), so a button taller than the
 * title leaves that space alone.
 */
export function BoxHead({
  title,
  count,
  hint,
  aside,
  actions,
  as: Tag = "h2",
  id,
}: {
  title: string;
  count?: number;
  /** A line under the title: what the box or dialog is for. */
  hint?: ReactNode;
  /** One thing beside the title, always: the Overview's status tag, Edit. */
  aside?: ReactNode;
  /** A row of buttons: beside the title, under it in a box narrower than 420px. */
  actions?: ReactNode;
  /** A span inside a link or button, where a heading may not go. */
  as?: "h2" | "h3" | "span";
  /** The title's id, for a dialog's `aria-labelledby`. */
  id?: string;
}) {
  const Wrap = Tag === "span" ? "span" : "div";

  return (
    <Wrap className="mb-(--box-pad) block @container">
      {/* The title takes the line's room (`basis-0`), so the aside stays beside it; only `actions` can wrap under. */}
      <Wrap className="flex flex-wrap items-baseline gap-x-2">
        <Wrap className="flex min-w-0 flex-1 basis-0 items-baseline gap-2">
          <Tag id={id} className="card-title">
            {title}
          </Tag>
          {count === undefined ? null : (
            <span className="meta-text tabular-nums">{count}</span>
          )}
        </Wrap>
        {aside ? <span className="-my-2 shrink-0 pl-2">{aside}</span> : null}
        {actions ? (
          <span className="mt-3 flex basis-full gap-2.5 @min-[420px]:-my-2 @min-[420px]:basis-auto @min-[420px]:pl-2">
            {actions}
          </span>
        ) : null}
      </Wrap>
      {hint ? <span className="mt-1.5 block hint-text">{hint}</span> : null}
    </Wrap>
  );
}
