import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { SIDE_PANEL_ID } from "@/components/dashboard/SidePanel";
import { BAR_ICON, QUIT_RULE, STRIP_ICON } from "@/components/dashboard/styles";
import type {
  SidePanel,
  SidePanelView,
} from "@/components/dashboard/useSidePanel";
import type { IconName } from "@/types/dashboard";

/** The count bubbles' look, in gold: on the strip's icons and in the phone's More menu. */
export const COUNT =
  "grid h-4 min-w-4 place-items-center rounded-full bg-warning-400 px-1 text-[10px] leading-none font-semibold text-neutral-950";
/**
 * On an icon: out at the corner, clear of the glyph; while its view is open,
 * in the open icon's gold, so the two read as one.
 */
const BADGE = `absolute -top-0.5 -right-0.5 ${COUNT} transition-colors group-aria-expanded:bg-secondary-400`;

/** What the strip and the phone's top bar show of the host: initials and two counts. */
export interface BarData {
  initials: string;
  alerts: number;
  /** Guests' replies sent since the host last opened the latest replies. */
  replies: number;
}

/** One of the side panel's views on the strip: its icon, name and count. */
interface BarView {
  view: Exclude<SidePanelView, "account">;
  icon: IconName;
  /** Its count and the `TopBar` aria label that says it; none for a view with no count. */
  count?: { key: "alertsCount" | "repliesCount"; value: number };
}

/** The side panel's views in the strip's order. */
export function countedViews(bar: BarData): BarView[] {
  return [
    /* The cart holds unsaved invitations, kept on the device: no count yet. */
    { view: "cart", icon: "cart" },
    {
      view: "alerts",
      icon: "bell",
      count: { key: "alertsCount", value: bar.alerts },
    },
    {
      view: "replies",
      icon: "envelope",
      count: { key: "repliesCount", value: bar.replies },
    },
  ];
}

/** The account circle: the host's initials, opening Your account. */
export function AccountButton({
  panel,
  initials,
}: {
  panel: SidePanel;
  initials: string;
}) {
  const t = useTranslations("TopBar");

  return (
    <button
      type="button"
      onClick={() => panel.select("account")}
      aria-controls={SIDE_PANEL_ID}
      aria-expanded={panel.open && panel.view === "account"}
      aria-label={t("account")}
      className="grid size-btn place-items-center rounded-full bg-primary-800 pl-[0.06em] text-xs leading-none font-semibold tracking-[0.06em] text-neutral-100 transition-colors hover:bg-primary-900"
    >
      {initials}
    </button>
  );
}

/**
 * Account, cart, alerts, latest replies and Quit dashboard down the strip
 * from `nav` up, built like the nav beside it, so each row lines up with its
 * own: the account in the logo's place (its top padding, 36px), the buttons
 * in a box padded like the nav's links, Quit at the foot level with the
 * nav's language, under the same 1px rule and 12px, the rule as wide as the
 * button. The editors' strip has its Quit in the same place. Each button
 * but the account names itself in a tip on hover (`icon-tip`). Below `nav` the phone's top bar has
 * the account and a More menu instead (`MoreMenu`).
 */
export function BarActions({ panel, bar }: { panel: SidePanel; bar: BarData }) {
  const t = useTranslations("TopBar");
  const tNav = useTranslations("Nav");

  return (
    <div className="flex h-full flex-col items-center pb-5 wide:pb-7">
      <div className="shrink-0 pt-chrome-top">
        <AccountButton panel={panel} initials={bar.initials} />
      </div>

      {/* Circle to circle, the same room as the account has above them (20px, 28px on large screens). */}
      <div className="flex min-h-0 flex-1 flex-col items-center gap-chrome-top pt-chrome-top pb-3">
        {countedViews(bar).map((each) => (
          <button
            key={each.view}
            type="button"
            onClick={() => panel.select(each.view)}
            aria-controls={SIDE_PANEL_ID}
            aria-expanded={panel.open && panel.view === each.view}
            aria-label={
              each.count
                ? t(each.count.key, { count: each.count.value })
                : t(each.view)
            }
            data-tip={t(each.view)}
            className={`group icon-tip ${BAR_ICON}`}
          >
            <Icon name={each.icon} {...STRIP_ICON} />
            {each.count ? (
              <span aria-hidden="true" className={BADGE}>
                {each.count.value}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className={QUIT_RULE}>
        <Link
          href="/"
          aria-label={tNav("quit")}
          data-tip={tNav("quit")}
          className={`icon-tip ${BAR_ICON}`}
        >
          <Icon name="quit" {...STRIP_ICON} />
        </Link>
      </div>
    </div>
  );
}
