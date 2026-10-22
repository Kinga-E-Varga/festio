"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  BLEED,
  CONTENT_WIDTH,
  PAGE_GUTTER,
} from "@/components/dashboard/styles";

interface EventPageBarProps {
  /** What the bar says: the event's name, or Home's date. */
  label: string;
  /** The page's name, e.g. Event details. */
  title: string;
  /** The page's one action, at the right of its title (Export on Guests). */
  action?: ReactNode;
  /** The page's open tab (Guests' Guest list or Summary), after its name in the bar. */
  tab?: string;
  /** An event page's, or Home's. */
  look?: keyof typeof LOOKS;
}

/**
 * How the bar's words and the title run: an event page's the whole width,
 * the bar taking on the title once it scrolls away; Home's capped like the
 * page under them, its date small caps and its greeting larger, the bar
 * keeping to its date.
 */
const LOOKS = {
  event: { width: "full", label: "", title: "page-title", echo: true },
  home: {
    width: "page",
    label: "eyebrow pl-1 text-neutral-900",
    title: "greeting-title",
    echo: false,
  },
} satisfies Record<
  string,
  {
    width: keyof typeof CONTENT_WIDTH;
    label: string;
    title: string;
    echo: boolean;
  }
>;

/**
 * The event's name (switching lives in the nav's picker), or Home's date, in a bar across
 * the whole width between the nav and the strip, its name level with the
 * logo and the account circle (the nav's top padding, then 36px), stuck
 * to the top while the page scrolls (under the phone's top bar, right
 * against it: there the top padding goes, as nothing sits beside it), pulled up
 * over main's top padding; then the page's own name, scrolling with the
 * page. Once that name has scrolled under the bar, the bar carries it after
 * the event's. No rules: the bar is the page's colour, so content slides
 * under it.
 */
export function EventPageBar({
  label,
  title,
  action,
  tab,
  look = "event",
}: EventPageBarProps) {
  const {
    width,
    label: labelClassName,
    title: titleClassName,
    echo: echoTitle,
  } = LOOKS[look];
  const barRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Nothing to echo, nothing to watch.
    if (!echoTitle) return;
    const check = () => {
      const bar = barRef.current?.getBoundingClientRect();
      const head = titleRef.current?.getBoundingClientRect();
      if (bar && head) setScrolled(head.bottom <= bar.bottom);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [echoTitle]);

  return (
    <>
      <div
        ref={barRef}
        className={`sticky top-topbar z-20 -mt-(--main-top) bg-neutral-125 nav:top-0 nav:pt-chrome-top ${BLEED}`}
      >
        <div className={PAGE_GUTTER}>
          <div
            className={`flex h-btn min-w-0 items-center gap-2 leading-[1.4] bar-text ${CONTENT_WIDTH[width]}`}
          >
            {/* With the page's name after it, on small screens capped at a third of the bar. */}
            <span
              className={`min-w-0 shrink truncate ${echoTitle && scrolled ? "max-nav:max-w-1/3" : ""} ${labelClassName}`}
            >
              {label}
            </span>
            {/* The page's name again, and its open tab, once its own has scrolled away. */}
            {echoTitle && scrolled ? (
              <span
                aria-hidden="true"
                className="flex min-w-0 shrink-[2] items-center gap-2"
              >
                <span>/</span>
                <span className="truncate">{title}</span>
                {tab ? (
                  <>
                    <span>/</span>
                    <span className="truncate">{tab}</span>
                  </>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div
        ref={titleRef}
        className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-2.5 ${CONTENT_WIDTH[width]}`}
      >
        <h1 className={`min-w-0 text-balance ${titleClassName}`}>{title}</h1>
        {action}
      </div>
    </>
  );
}
