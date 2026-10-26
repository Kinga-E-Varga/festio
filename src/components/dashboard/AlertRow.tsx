import type { ReactNode } from "react";

/**
 * A warning prompt's inside (`ALERT` frame, `@container`, around it): its
 * question, then its buttons at the right. Narrower than 400px they stack,
 * both centred.
 */
export function AlertRow({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center @min-[400px]:flex-row @min-[400px]:text-left">
      <span className="@min-[400px]:mr-auto">{title}</span>
      <div className="flex shrink-0 items-center gap-2.5">{children}</div>
    </div>
  );
}
