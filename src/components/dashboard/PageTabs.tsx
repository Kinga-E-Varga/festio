"use client";

import { Link } from "@/i18n/navigation";

export interface PageTab {
  key: string;
  label: string;
  href: string;
  current: boolean;
}

/**
 * A page's tabs under its title, each its own address so a link can open
 * one: underlined, the current one in the event bar's ink, ruled off from the page below.
 */
export function PageTabs({ tabs, label }: { tabs: PageTab[]; label: string }) {
  return (
    <nav aria-label={label} className="border-b border-neutral-300">
      <ul className="-mb-px flex gap-6">
        {tabs.map((tab) => (
          <li key={tab.key}>
            <Link
              href={tab.href}
              scroll={false}
              aria-current={tab.current ? "page" : undefined}
              className={`block border-b-2 pt-1 pb-3 transition-colors ${
                tab.current
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
