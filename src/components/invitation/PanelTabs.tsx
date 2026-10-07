"use client";

import { useTranslations } from "next-intl";

/*
 * The editor's tabs in warm neutral: each hangs a pixel below the row so its
 * 3px edge sits on the row's line rather than doubling it. The open tab
 * shows only that edge; the others take a pale fill and the edge on hover.
 */
const TAB =
  "-mb-px h-10 flex-1 rounded-t-xs border-b-3 border-transparent text-[14px] font-[500] text-neutral-900 transition-colors not-aria-selected:hover:border-neutral-800 not-aria-selected:hover:bg-mustard-200 aria-selected:text-mustard-100 aria-selected:bg-neutral-900 aria-selected:border-neutral-900 aria-selected:font-[500] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-steel-500";

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
