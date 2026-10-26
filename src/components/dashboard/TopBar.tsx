import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { AccountButton, type BarData } from "@/components/dashboard/BarActions";
import { MoreMenu } from "@/components/dashboard/MoreMenu";
import { BAR_ICON, STRIP_ICON } from "@/components/dashboard/styles";
import type { SidePanel } from "@/components/dashboard/useSidePanel";

interface TopBarProps {
  navOpen: boolean;
  onToggleNav: () => void;
  panel: SidePanel;
  bar: BarData;
}

/**
 * The dashboard's bar below `nav` only, across the top like the editors'
 * (`EditorFrame`): from `nav` up the logo heads the docked nav and the
 * actions stand in the right-hand strip. Here the menu at the left; at the
 * right the More menu (cart, alerts, latest replies, language) and the
 * account, in the strip's colours. A layer above the nav
 * drawer and the side panel, so they slide out from under it and their
 * shadows never grey it.
 */
export function TopBar({ navOpen, onToggleNav, panel, bar }: TopBarProps) {
  const t = useTranslations("TopBar");

  return (
    <div className="sticky top-0 z-50 flex h-topbar shrink-0 items-center justify-between border-b border-neutral-300 bg-neutral-125 px-3 font-sans nav:hidden">
      <button
        type="button"
        onClick={onToggleNav}
        aria-expanded={navOpen}
        aria-label={t("openMenu")}
        className={BAR_ICON}
      >
        <Icon name="menu" {...STRIP_ICON} />
      </button>

      <div className="flex items-center gap-2">
        <MoreMenu panel={panel} bar={bar} />
        <AccountButton panel={panel} initials={bar.initials} />
      </div>
    </div>
  );
}
