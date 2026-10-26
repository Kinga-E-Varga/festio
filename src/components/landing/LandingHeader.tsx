import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { BUTTON, LOCKUP } from "@/components/dashboard/styles";
import type { BarData } from "@/components/dashboard/BarActions";
import { AccountList } from "@/components/dashboard/AccountList";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { CartList } from "@/components/dashboard/CartList";
import type { AttentionNotice } from "@/types/dashboard";
import { HeaderPopover } from "./HeaderPopover";

/*
 * A copy of the dashboard's top bar, so the dashboard can be redone without
 * touching this one. No nav to open here, so the lockup keeps the corner at
 * every width. The bell, the cart and the account circle open what the
 * dashboard's side panel shows for them, in a box under the icon
 * (`HeaderPopover`); the account's heads with Dashboard.
 */

/** 32px circles around 20px icons: the strip's 22 in 36, a step down, the same line. */
const ICON = { className: "size-5", strokeWidth: 1.75 };
const ICON_BUTTON =
  "relative grid size-8 place-items-center rounded-full text-neutral-100 transition-colors hover:bg-primary-800 aria-expanded:bg-primary-800";

/** The dark bar across the top. Position is the caller's. */
const TOP_BAR =
  "flex h-topbar shrink-0 items-center gap-3.5 bg-primary-900 px-4 font-sans text-secondary-100 sm:px-6";

/** Signed out, in the account circle's place: the app's button, round, in the circle's gold. */
const SIGN_IN = `${BUTTON} h-8! rounded-full! border-secondary-400 bg-secondary-400 text-neutral-950 hover:border-secondary-300 hover:bg-secondary-300`;

/**
 * Signed in, beside the account circle: the same round button, outlined in
 * the circle's gold, so the circle stays the one filled mark. Set apart from the bell and the cart:
 * those two are things to look at, these two are where to go. Gone below
 * `sm` (640px), where the bar gets crowded (the longest label, "Vezérlőpult",
 * meets the logo at about 398px); the account menu still has Dashboard.
 */
const DASHBOARD = `${BUTTON} ml-3 h-8! rounded-full! max-sm:hidden border-secondary-400 bg-transparent text-secondary-400 hover:bg-primary-800`;

/**
 * The bell's count bubble: just inside the circle's corner, over the
 * bell's top right, a size down from the dashboard strip's. A pixel
 * less on the left: Work Sans's digits sit right of their own middle.
 */
const BADGE =
  "absolute top-0.5 right-0.5 grid h-3.5 min-w-3.5 place-items-center rounded-full pr-[3px] pl-[2px] text-[10px] leading-none font-bold text-primary-900";

/**
 * `bar` is null when no host is signed in: no bell, and a Sign in button
 * where the account goes. `notices` are the bell's, the dashboard's alerts.
 */
export function LandingHeader({
  bar,
  notices,
}: {
  bar: BarData | null;
  notices: AttentionNotice[];
}) {
  const t = useTranslations("TopBar");
  const tNav = useTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 bg-primary-900">
      <div className={TOP_BAR}>
        <Link href="/" aria-label="Festio" className="flex items-center">
          <span
            aria-hidden="true"
            className={`h-7 bg-secondary-400 ${LOCKUP}`}
          />
        </Link>

        {/*
         * Bell, cart and account evenly apart, counted between their 32px
         * circles: the bell's and the cart's hover circles, the account's
         * fill.
         */}
        <div className="ml-auto flex items-center gap-3">
          {bar ? (
            <HeaderPopover
              id="landing-alerts"
              label={t("alertsCount", { count: bar.alerts })}
              title={t("alerts")}
              buttonClassName={ICON_BUTTON}
              button={
                <>
                  <Icon name="bell" {...ICON} />
                  <span
                    aria-hidden="true"
                    className={`${BADGE} bg-warning-400`}
                  >
                    {bar.alerts}
                  </span>
                </>
              }
            >
              <AlertsList notices={notices} />
            </HeaderPopover>
          ) : null}

          <HeaderPopover
            id="landing-cart"
            label={t("cart")}
            title={t("cart")}
            buttonClassName={ICON_BUTTON}
            button={<Icon name="cart" {...ICON} />}
          >
            <CartList />
          </HeaderPopover>

          {bar ? (
            <Link href="/dashboard" className={DASHBOARD}>
              {tNav("dashboard")}
            </Link>
          ) : null}

          {bar ? (
            <HeaderPopover
              id="landing-account"
              label={t("account")}
              title={t("account")}
              buttonClassName="grid size-8 cursor-pointer place-items-center rounded-full bg-secondary-400 text-xs font-semibold tracking-[0.06em] text-neutral-950 transition-colors hover:bg-secondary-300 aria-expanded:bg-secondary-300"
              button={bar.initials}
            >
              <AccountList dashboard />
            </HeaderPopover>
          ) : (
            <Link href="/sign-in" className={SIGN_IN}>
              {t("signIn")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
