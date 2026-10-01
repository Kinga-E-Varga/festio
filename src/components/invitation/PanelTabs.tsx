"use client";

import { useTranslations } from "next-intl";
import { PANEL_TAB } from "./styles";

/**
 * The editor's tabs, in the order the host meets them: the invitation's
 * text, then the reply's, then the design. Shared by the simple and the
 * modular edit panels, which differ only in what each tab holds.
 */
const TABS = [
  { id: "text", labelKey: "tabText" },
  { id: "response", labelKey: "tabResponse" },
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
    // `contents`, so the tabs are segments of the header's own row, next to its X.
    <div role="tablist" className="contents">
      {TABS.map((each) => (
        <button
          key={each.id}
          type="button"
          role="tab"
          id={tabElementId(each.id)}
          aria-selected={tab === each.id}
          data-active={tab === each.id ? "true" : undefined}
          aria-controls={TABPANEL_ID}
          onClick={() => onSelect(each.id)}
          className={PANEL_TAB}
        >
          {t(each.labelKey)}
        </button>
      ))}
    </div>
  );
}
