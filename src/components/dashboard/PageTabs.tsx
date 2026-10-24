"use client";

import type { MouseEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";

export interface PageTab {
  key: string;
  label: string;
  href: string;
  /** The tab's `?view=` value; `null` for the one with none. */
  view: string | null;
}

/** The open tab, worked out in the browser from `?view=`; an unknown value falls back to the one with none. */
export function useCurrentTab(tabs: PageTab[] | undefined) {
  const view = useSearchParams().get("view");
  return (
    tabs?.find((tab) => tab.view === view) ??
    tabs?.find((tab) => tab.view === null)
  );
}

/** A plain click only changes the address: the page is already here, so no server render. */
function switchInBrowser(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  event.preventDefault();
  /* The tab already open: no second history entry. */
  if (event.currentTarget.href === window.location.href) return;
  window.history.pushState(null, "", event.currentTarget.href);
}

/**
 * A page's tabs under its title, each its own address so a link can open
 * one: underlined, the current one in the event bar's ink, ruled off from the page below.
 */
export function PageTabs({ tabs, label }: { tabs: PageTab[]; label: string }) {
  const current = useCurrentTab(tabs);

  return (
    <nav aria-label={label} className="border-b border-neutral-300">
      <ul className="-mb-px flex gap-6">
        {tabs.map((tab) => (
          <li key={tab.key}>
            <Link
              href={tab.href}
              scroll={false}
              onClick={switchInBrowser}
              aria-current={tab === current ? "page" : undefined}
              className={`block border-b-2 pt-1 pb-3 transition-colors ${
                tab === current
                  ? "bar-text border-neutral-900"
                  : "nav-text border-transparent font-medium text-neutral-700 hover:border-neutral-400 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
