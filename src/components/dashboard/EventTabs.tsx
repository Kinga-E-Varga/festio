"use client";

import { useState, type ReactNode } from "react";

export interface EventTab {
  id: string;
  label: string;
  count: number;
  /** Server-rendered list for this tab. */
  panel: ReactNode;
}

export function EventTabs({ tabs }: { tabs: EventTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  function selectByOffset(index: number, offset: number) {
    const next = tabs[(index + offset + tabs.length) % tabs.length];
    setActiveId(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Event status"
        className="flex flex-wrap items-center gap-1 border-b border-forest-500"
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
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
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
              // The active tab hangs a pixel below the list so its own bottom
              // border sits on the divider rather than doubling it.
              // Colour lives in both branches rather than on the base: two
              // text-colour utilities on one element resolve by stylesheet
              // order, not by the order they are written.
              className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-[9px] transition-colors ${
                isActive
                  ? "border-forest-500 bg-forest-500 font-semibold text-mustard-50"
                  : "border-transparent text-forest-600"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs tabular-nums ${
                  isActive ? "text-mustard-50" : "text-forest-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeId}
          className="pt-5"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
