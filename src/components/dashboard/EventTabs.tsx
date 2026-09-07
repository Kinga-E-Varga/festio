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
        className="flex flex-wrap items-center gap-1.5 border-b border-linen-200 pb-2"
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
              className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 transition-colors ${
                isActive
                  ? "border border-linen-200 bg-cream-50 font-medium text-ink-900"
                  : "border border-transparent text-stone-500 hover:bg-cream-50/70 hover:text-ink-900"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs tabular-nums ${
                  isActive ? "text-sage-600" : "text-stone-400"
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
          className="pt-4"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
