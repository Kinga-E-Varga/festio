import { useTranslations } from "next-intl";
import type { IconName } from "@/types/dashboard";
import type { StripView } from "./EditorFrame";

/**
 * The invitation editors' tabs, in the order the host meets them: the design
 * first, then the invitation's content, then the reply's. Each is a button
 * on the editor's strip (`EditorFrame`) that opens the side panel on it.
 * Shared by the simple and the modular editor, which differ only in what
 * each tab holds. The icons are the modular preview's Design and Content
 * buttons'.
 */
export const TABS = [
  { id: "design", labelKey: "tabDesign", icon: "brush" },
  { id: "content", labelKey: "tabContent", icon: "fonts" },
  { id: "replies", labelKey: "tabReplies", icon: "guests" },
] as const satisfies readonly {
  id: string;
  labelKey: string;
  icon: IconName;
}[];

export type PanelTabId = (typeof TABS)[number]["id"];

/** Each tab's message key in `HostEditor`: the panel's title. */
export const TAB_LABEL = Object.fromEntries(
  TABS.map((each) => [each.id, each.labelKey]),
) as Record<PanelTabId, (typeof TABS)[number]["labelKey"]>;

/** The tabs as the strip's buttons, in the host's language. */
export function useTabViews(): StripView<PanelTabId>[] {
  const t = useTranslations("HostEditor");
  return TABS.map((each) => ({
    id: each.id,
    label: t(each.labelKey),
    icon: each.icon,
  }));
}
