"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { fold } from "@/components/dashboard/guest-list/styles";

/**
 * What a row's button opens, rolling out under it: the cancel form, a delete's
 * "are you sure". While it grows the page follows its foot, so it never grows
 * out of view at the bottom of the page. Its content starts afresh each time
 * it opens (a form empty again) and folds away as it was.
 */
export function RollOut({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  /* Counts the openings; a new one rebuilds the content, not the roll-out around it. */
  const [round, setRound] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setRound(round + 1);
  }

  /* While it rolls out, keep its foot on screen, one frame at a time. */
  useEffect(() => {
    const el = box.current;
    if (!open || !el) return;
    let frame = requestAnimationFrame(function follow() {
      el.scrollIntoView({ block: "nearest" });
      frame = requestAnimationFrame(follow);
    });
    const stop = () => cancelAnimationFrame(frame);
    /* The fields' own transitions bubble up too; only the roll-out's counts. */
    const done = (e: TransitionEvent) => {
      if (e.target === el) stop();
    };
    el.addEventListener("transitionend", done);
    /* In case the roll-out never ends (reduced motion): a little past its 450ms. */
    const fallback = setTimeout(stop, 600);
    return () => {
      stop();
      clearTimeout(fallback);
      el.removeEventListener("transitionend", done);
    };
  }, [open]);

  return (
    <div ref={box} inert={!open} className={`scroll-mb-16 ${fold(open)}`}>
      <div className="min-h-0 overflow-hidden">
        <div key={round} className="pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
