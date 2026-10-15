"use client";

import { useState, type ReactNode } from "react";

export interface EventTab {
  id: string;
  label: string;
  count: number;
  /** Server-rendered list for this tab. */
  panel: ReactNode;
}

export function EventTabs({
  tabs,
  label,
  initialId = tabs[0]?.id ?? null,
  fallback,
}: {
  tabs: EventTab[];
  /** What the tabs sort, for the tablist's own accessible name. */
  label: string;
  /**
   * Which tab opens selected. `null` opens with none of them selected, for a
   * page that arrived showing one record picked out elsewhere.
   */
  initialId?: string | null;
  /** Shown in place of the panels while no tab is selected. */
  fallback?: ReactNode;
}) {
  const [activeId, setActiveId] = useState<string | null>(initialId);
  const [arrivedOn, setArrivedOn] = useState<string | null>(initialId);

  /*
   * Arriving at the page again — following its own way out of a narrowed
   * view, say — hands down a new starting tab. The component is not remounted
   * by that navigation, so the tab it was left on has to give way here.
   */
  if (initialId !== arrivedOn) {
    setArrivedOn(initialId);
    setActiveId(initialId);
  }

  /*
   * Choosing a tab leaves whatever picked one record out, so the query that
   * narrowed the page goes with it and a reload lands on the list. The
   * address is rewritten in place rather than navigated to: a navigation
   * would hand down a starting tab of its own and overrule the choice just
   * made here.
   */
  function select(id: string) {
    if (activeId === null && window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    setActiveId(id);
  }

  function selectByOffset(index: number, offset: number) {
    const next = tabs[(index + offset + tabs.length) % tabs.length];
    select(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <div>
      {/* Plain buttons over the homepage's divider: the same line, 12px under. */}
      <div className="border-b border-neutral-400 pb-3">
        <div
          role="tablist"
          aria-label={label}
          className="flex flex-wrap items-center gap-0.5 sm:grid sm:w-max sm:grid-flow-col sm:auto-cols-fr sm:gap-1"
        >
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeId;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                // With nothing selected the list still needs one way in, so
                // the first tab holds the tab stop until a choice is made.
                tabIndex={
                  isActive || (activeId === null && index === 0) ? 0 : -1
                }
                onClick={() => select(tab.id)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    selectByOffset(index, 1);
                  }
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    selectByOffset(index, -1);
                  }
                }}
                // Shaped and coloured like the nav's buttons. Colour lives in both branches rather than on the base: two
                // text-colour utilities on one element resolve by stylesheet
                // order, not by the order they are written.
                className={`flex h-btn items-center justify-center gap-1.5 rounded-ui px-3 text-[14px] whitespace-nowrap transition-colors sm:px-4 ${
                  isActive
                    ? "bg-primary-800 font-medium text-neutral-50"
                    : "text-neutral-900 hover:bg-secondary-400/30 hover:text-neutral-950"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[12.5px] tabular-nums ${
                    isActive ? "text-neutral-50/70" : "text-neutral-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeId === null ? (
        <div className="pt-4">{fallback}</div>
      ) : (
        tabs.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== activeId}
            className="pt-4"
          >
            {tab.panel}
          </div>
        ))
      )}
    </div>
  );
}
