import type { ReactNode } from "react";

/**
 * A row's words: its name, then a quieter line under it, then anything more.
 * `titleEnd` and `detailEnd` sit at the right end of those two lines, on
 * them, so they line up with the words without measuring anything.
 */
export function RowLines({
  title,
  detail,
  titleEnd,
  detailEnd,
  children,
  className = "",
}: {
  title: string;
  detail: ReactNode;
  titleEnd?: ReactNode;
  detailEnd?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span className={`flex min-w-0 flex-1 flex-col gap-0.5 ${className}`}>
      <span className="flex items-center justify-between gap-4 name-text leading-[1.35]">
        <span className="min-w-0 truncate">{title}</span>
        {titleEnd}
      </span>
      <span className="flex items-baseline justify-between gap-4 meta-text leading-[1.4]">
        <span className="min-w-0">{detail}</span>
        {detailEnd}
      </span>
      {children}
    </span>
  );
}
