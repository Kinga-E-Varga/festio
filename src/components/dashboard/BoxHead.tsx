import type { ReactNode } from "react";

/**
 * A box's head: its serif title, how many things it holds right after it,
 * and anything that belongs at its far right (the Overview's status tag).
 */
export function BoxHead({
  title,
  count,
  aside,
  as: Tag = "h2",
}: {
  title: string;
  count?: number;
  aside?: ReactNode;
  /** A span inside a link or button, where a heading may not go. */
  as?: "h2" | "span";
}) {
  const Wrap = Tag === "h2" ? "div" : "span";

  return (
    <Wrap className="mb-3 flex items-baseline gap-2">
      <Tag className="card-title">{title}</Tag>
      {count === undefined ? null : (
        <span className="meta-text tabular-nums">{count}</span>
      )}
      {aside ? <span className="ml-auto shrink-0 pl-2">{aside}</span> : null}
    </Wrap>
  );
}
