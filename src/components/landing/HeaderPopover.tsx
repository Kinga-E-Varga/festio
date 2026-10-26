"use client";

import { type ReactNode, useCallback, useRef, useState } from "react";
import { useDismiss } from "@/components/dashboard/event-nav/useDismiss";
import { MENU_SURFACE } from "@/components/dashboard/styles";

/**
 * One of the landing bar's icons and what it opens: a box floating under
 * it, like the strip's language menu, holding what the dashboard's side
 * panel shows for it under the same title. A press outside or Escape
 * closes it.
 */
export function HeaderPopover({
  id,
  label,
  title,
  buttonClassName,
  button,
  children,
}: {
  id: string;
  /** What the icon says to screen readers. */
  label: string;
  title: string;
  buttonClassName: string;
  /** The icon, and its count if any. */
  button: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, rootRef, close);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        className={buttonClassName}
      >
        {button}
      </button>

      {/* A link inside leaves the page, so it closes the box too. */}
      <div
        id={id}
        role="region"
        aria-label={title}
        hidden={!open}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) close();
        }}
        className={`absolute top-full right-0 z-10 mt-2 w-80 max-w-[calc(100vw-32px)] text-neutral-800 ${MENU_SURFACE}`}
      >
        <h2 className="px-[18px] pt-4 card-title">{title}</h2>
        <div className="side-scroll max-h-[60vh] overflow-y-auto px-[18px] pt-3 pb-4 [--scroll-track:var(--color-neutral-50)]">
          {children}
        </div>
      </div>
    </div>
  );
}
