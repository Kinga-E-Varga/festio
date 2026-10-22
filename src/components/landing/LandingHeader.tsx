import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { ATTENTION_NOTICES, HOST, UNPAID_EVENTS } from "@/mock/dashboard";

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

/** Count bubbles on the bell and the cart share everything but their colour. */
const BADGE =
  "absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-primary-900";

export function LandingHeader() {
  const t = useTranslations("TopBar");
  const awaitingPayment = UNPAID_EVENTS.length;

  return (
    <header className="sticky top-0 z-40 bg-primary-900">
      <div className={`mx-auto max-w-app ${TOP_BAR}`}>
        <Link href="/" aria-label="Festio" className="flex items-center">
          <span
            aria-hidden="true"
            className="block aspect-[148/32] h-6 bg-secondary-400 mask-[url(/festio-lockup-alt.svg)] mask-contain mask-center mask-no-repeat"
          />
        </Link>

        {/*
         * Bell and cart pair up tightly. The gap looks smaller than it reads:
         * each 20px glyph carries 7px of hit area either side, so 4px here is
         * 18px of visible space between the two marks.
         */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label={t("alertsCount", { count: ATTENTION_NOTICES.length })}
            className={ICON_BUTTON}
          >
            <Icon name="bell" className="size-5" />
            <span aria-hidden="true" className={`${BADGE} bg-warning-400`}>
              {ATTENTION_NOTICES.length}
            </span>
          </button>

          <button
            type="button"
            aria-label={t("cartCount", { count: awaitingPayment })}
            className={ICON_BUTTON}
          >
            <Icon name="cart" className="size-5" />
            <span aria-hidden="true" className={`${BADGE} bg-secondary-400`}>
              {awaitingPayment}
            </span>
          </button>

          <Link
            href="/dashboard"
            aria-label={t("account")}
            className="ml-2.5 grid size-[30px] place-items-center rounded-full bg-secondary-400 text-xs font-semibold tracking-[0.06em] text-neutral-950 transition-colors hover:bg-secondary-300"
          >
            {HOST.initials}
          </Link>
        </div>
      </div>
    </header>
  );
}
