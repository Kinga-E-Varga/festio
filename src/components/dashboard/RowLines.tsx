import type { ReactNode } from "react";

/** A row's words: its name, then a quieter line under it, then anything more. */
export function RowLines({
  title,
  detail,
  children,
  className = "",
}: {
  title: string;
  detail: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span className={`flex min-w-0 flex-1 flex-col gap-0.5 ${className}`}>
      <span className="truncate name-text leading-[1.35]">{title}</span>
      <span className="meta-text leading-[1.4]">{detail}</span>
      {children}
    </span>
  );
}
