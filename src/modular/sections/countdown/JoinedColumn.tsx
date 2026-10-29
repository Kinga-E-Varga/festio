import type { ReactNode } from "react";
import { SPLIT } from "@/modular/styles";

/**
 * The joined countdowns' frame: their content in a centred column, and
 * under a section drawn in two columns (`afterSplit`) the same `SPLIT`
 * grid, the content in the second column, so it lines up with what is
 * above it. The first column stays empty, and is left out on a phone,
 * where the grid is one column.
 */
export function JoinedColumn({
  afterSplit = false,
  className,
  children,
}: {
  afterSplit?: boolean;
  className: string;
  children: ReactNode;
}) {
  const column = "flex flex-col items-center gap-7";
  if (!afterSplit) {
    return <div className={`${column} ${className}`}>{children}</div>;
  }
  return (
    <div className={`${SPLIT} ${className}`}>
      <div aria-hidden="true" className="hidden @3xl:block" />
      <div className={column}>{children}</div>
    </div>
  );
}
