"use client";

import { useTranslations } from "next-intl";

/*
 * The editor's tabs in warm neutral: each hangs a pixel below the row so its
 * 3px edge sits on the row's line rather than doubling it. The open tab is
 * filled with light text; the others take a pale fill and the edge on hover.
 */
const TAB =
  "-mb-px h-10 flex-1 rounded-t-xs border-b-3 border-transparent text-[14px] font-medium text-neutral-800 transition-colors not-aria-selected:hover:border-neutral-800 not-aria-selected:hover:bg-neutral-300 aria-selected:border-neutral-800 aria-selected:bg-neutral-800 aria-selected:font-semibold aria-selected:text-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-steel-500";

/**
 * The editor's tabs, in the order the host meets them: the invitation's
 * text, then the reply's, then the design. Shared by the simple and the
 * modular edit panels, which differ only in what each tab holds.
 */
const TABS = [
  { id: "text", labelKey: "tabText" },
  { id: "replies", labelKey: "tabReplies" },
  { id: "design", labelKey: "tabDesign" },
] as const;

export type PanelTabId = (typeof TABS)[number]["id"];

/** The one tab panel the tabs control. */
export const TABPANEL_ID = "edit-tabpanel";

export function tabElementId(tab: PanelTabId): string {
  return `edit-tab-${tab}`;
}

export function PanelTabs({
  tab,
  onSelect,
}: {
  tab: PanelTabId;
  onSelect: (tab: PanelTabId) => void;
}) {
  const t = useTranslations("HostEditor");

  return (
    <div role="tablist" className="flex flex-1 gap-1">
      {TABS.map((each) => (
        <button
          key={each.id}
          type="button"
          role="tab"
          id={tabElementId(each.id)}
          aria-selected={tab === each.id}
          aria-controls={TABPANEL_ID}
          onClick={() => onSelect(each.id)}
          className={TAB}
        >
          {t(each.labelKey)}
        </button>
      ))}
    </div>
  );
}
