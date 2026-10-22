import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { LanguageMenu } from "@/components/dashboard/LanguageMenu";
import { SIDE_PANEL_ID } from "@/components/dashboard/SidePanel";
import { BAR_ICON, STRIP_ICON } from "@/components/dashboard/styles";
import type {
  SidePanel,
  SidePanelView,
} from "@/components/dashboard/useSidePanel";
import {
  ATTENTION_NOTICES,
  HOST,
  NEW_REPLIES,
  UNPAID_EVENTS,
} from "@/mock/dashboard";
import type { IconName } from "@/types/dashboard";

/** The count bubbles' look, in gold: on the strip's icons and in the phone's More menu. */
export const COUNT =
  "grid h-4 min-w-4 place-items-center rounded-full bg-warning-400 px-1 text-[10px] leading-none font-semibold text-neutral-950";
/**
 * On an icon: out at the corner, clear of the glyph; while its view is open,
 * in the open icon's gold, so the two read as one.
 */
const BADGE = `absolute -top-0.5 -right-0.5 ${COUNT} transition-colors group-aria-expanded:bg-secondary-400`;

/** The side panel's views with a count, in the strip's order: each its icon, name and count. */
export const COUNTED_VIEWS: {
  view: Exclude<SidePanelView, "account">;
  icon: IconName;
  /** Its aria label with the count, in `TopBar`. */
  countKey: "cartCount" | "alertsCount" | "repliesCount";
  count: number;
}[] = [
  {
    view: "cart",
    icon: "cart",
    countKey: "cartCount",
    count: UNPAID_EVENTS.length,
  },
  {
    view: "alerts",
    icon: "bell",
    countKey: "alertsCount",
    count: ATTENTION_NOTICES.length,
  },
  {
    view: "replies",
    icon: "guests",
    countKey: "repliesCount",
    count: NEW_REPLIES,
  },
];

/** The account circle: the host's initials, opening Your account. */
export function AccountButton({
  panel,
  className = "",
}: {
  panel: SidePanel;
  /** The phone's top bar's bigger circle. */
  className?: string;
}) {
  const t = useTranslations("TopBar");

  return (
    <button
      type="button"
      onClick={() => panel.select("account")}
      aria-controls={SIDE_PANEL_ID}
      aria-expanded={panel.open && panel.view === "account"}
      aria-label={t("account")}
      className={`grid size-btn place-items-center rounded-full bg-primary-800 pl-[0.06em] text-xs leading-none font-semibold tracking-[0.06em] text-neutral-100 transition-colors hover:bg-primary-900 ${className}`}
    >
      {HOST.initials}
    </button>
  );
}

/**
 * Account, cart, alerts, latest replies and language down the strip from
 * `nav` up, built like the nav beside it, so each row lines up with its own:
 * the account in the logo's place (its top padding, 36px), the buttons in a
 * box padded like the nav's links, language at the foot like Quit, under the
 * same 1px rule (here clear) and 12px. Below `nav` the phone's top bar has
 * the account and a More menu instead (`MoreMenu`).
 */
export function BarActions({ panel }: { panel: SidePanel }) {
  const t = useTranslations("TopBar");

  return (
    <div className="flex h-full flex-col items-center pb-5 wide:pb-7">
      <div className="shrink-0 pt-chrome-top">
        <AccountButton panel={panel} />
      </div>

      {/* Each glyph carries hit area either side, so a gap reads wider than it is: 20px. */}
      <div className="flex min-h-0 flex-1 flex-col items-center gap-5 pt-chrome-top pb-3">
        {COUNTED_VIEWS.map((each) => (
          <button
            key={each.view}
            type="button"
            onClick={() => panel.select(each.view)}
            aria-controls={SIDE_PANEL_ID}
            aria-expanded={panel.open && panel.view === each.view}
            aria-label={t(each.countKey, { count: each.count })}
            className={`group ${BAR_ICON}`}
          >
            <Icon name={each.icon} {...STRIP_ICON} />
            <span aria-hidden="true" className={BADGE}>
              {each.count}
            </span>
          </button>
        ))}
      </div>

      <div className="border-t border-transparent pt-3">
        <LanguageMenu />
      </div>
    </div>
  );
}
