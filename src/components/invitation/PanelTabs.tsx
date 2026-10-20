"use client";

import { useTranslations } from "next-intl";

/*
 * The editor's tabs, the Save button's size and type, side by side as
 * separate buttons. Every tab takes the top bar's fill and ink; the open one
 * primary-800 at 90%, and any one primary-800 on hover.
 */
const TAB =
  "h-btn flex-1 rounded-ui text-[12.5px] font-medium bg-primary-900 text-secondary-100 transition-colors aria-selected:bg-primary-800/90 hover:bg-primary-800 aria-selected:hover:bg-primary-800 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-info-600";

/**
 * The editor's tabs, in the order the host meets them: the design first,
 * then the invitation's content, then the reply's. Shared by the simple and the
 * modular edit panels, which differ only in what each tab holds.
 */
const TABS = [
  { id: "design", labelKey: "tabDesign" },
  { id: "content", labelKey: "tabContent" },
  { id: "replies", labelKey: "tabReplies" },
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
    <div role="tablist" className="flex flex-1 gap-2">
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
