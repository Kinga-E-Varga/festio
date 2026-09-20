import Link from "next/link";
import type { ReactNode } from "react";

interface FocusViewProps {
  /** What the page is narrowed to, e.g. "Showing the selected event only." */
  note: string;
  /** The same list with nothing picked out. */
  href: string;
  linkLabel: string;
  /** The one record itself. */
  children: ReactNode;
}

/**
 * A list narrowed to the one record another page handed it, in place of its
 * tab panels. The arrival aims at this whole block rather than at the record,
 * so the note cannot end up scrolled off above the record it explains.
 */
export function FocusView({ note, href, linkLabel, children }: FocusViewProps) {
  return (
    <div id="focus" className="scroll-mt-[88px]">
      {/*
       * The tabs above are all unselected, which on its own says nothing.
       * This says it, and is the way back to the full list.
       */}
      <p className="mb-[26px] flex flex-wrap items-center gap-x-2 gap-y-1 border border-mustard-300 bg-mustard-100 px-4 py-3 text-[13px] text-neutral-700">
        <span>{note}</span>
        <Link
          href={href}
          className="font-medium text-forest-500 underline underline-offset-2 transition-colors hover:text-forest-600"
        >
          {linkLabel}
        </Link>
      </p>

      {children}
    </div>
  );
}
