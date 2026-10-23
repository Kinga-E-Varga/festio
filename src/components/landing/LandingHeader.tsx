import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { LOCKUP } from "@/components/dashboard/styles";
import type { BarData } from "@/components/dashboard/BarActions";

/*
 * A copy of the dashboard's top bar, so the dashboard can be redone without
 * touching this one. No nav to open here, so the lockup keeps the corner at
 * every width; the bell opens nothing yet.
 */

const ICON_BUTTON =
  "relative grid size-[34px] place-items-center rounded-full text-neutral-100 transition-colors hover:bg-primary-800";

/** The dark bar across the top. Position is the caller's. */
const TOP_BAR =
  "flex h-topbar shrink-0 items-center gap-3.5 bg-primary-900 px-4 font-sans text-secondary-100 sm:px-6";

/** The bell's count bubble. */
const BADGE =
  "absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-primary-900";

/** `bar` is null when no host is signed in: a Sign in link stands in for the counts. */
export function LandingHeader({ bar }: { bar: BarData | null }) {
  const t = useTranslations("TopBar");

  return (
    <header className="sticky top-0 z-40 bg-primary-900">
      <div className={`mx-auto max-w-app ${TOP_BAR}`}>
        <Link href="/" aria-label="Festio" className="flex items-center">
          <span
            aria-hidden="true"
            className={`h-6 bg-secondary-400 ${LOCKUP}`}
          />
        </Link>

        {/*
         * Bell and cart pair up tightly. The gap looks smaller than it reads:
         * each 20px glyph carries 7px of hit area either side, so 4px here is
         * 18px of visible space between the two marks.
         */}
        {bar ? (
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              aria-label={t("alertsCount", { count: bar.alerts })}
              className={ICON_BUTTON}
            >
              <Icon name="bell" className="size-5" />
              <span aria-hidden="true" className={`${BADGE} bg-warning-400`}>
                {bar.alerts}
              </span>
            </button>

            <button
              type="button"
              aria-label={t("cart")}
              className={ICON_BUTTON}
            >
              <Icon name="cart" className="size-5" />
            </button>

            <Link
              href="/dashboard"
              aria-label={t("account")}
              className="ml-2.5 grid size-[30px] place-items-center rounded-full bg-secondary-400 text-xs font-semibold tracking-[0.06em] text-neutral-950 transition-colors hover:bg-secondary-300"
            >
              {bar.initials}
            </Link>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="ml-auto rounded-ui px-3 py-1.5 button-text text-secondary-100 transition-colors hover:bg-primary-800"
          >
            {t("signIn")}
          </Link>
        )}
      </div>
    </header>
  );
}
