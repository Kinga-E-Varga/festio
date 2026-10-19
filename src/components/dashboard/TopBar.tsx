import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { TOP_BAR } from "@/components/dashboard/styles";
import { ATTENTION_NOTICES, EVENTS, HOST } from "@/mock/dashboard";

interface TopBarProps {
  navOpen: boolean;
  noticesOpen: boolean;
  onToggleNav: () => void;
  onToggleNotices: () => void;
}

const ICON_BUTTON =
  "relative grid size-[34px] place-items-center rounded-full text-neutral-100 transition-colors hover:bg-primary-800";

/** Count bubbles on the bell and the cart share everything but their colour. */
const BADGE =
  "absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-primary-900";

export function TopBar({
  navOpen,
  noticesOpen,
  onToggleNav,
  onToggleNotices,
}: TopBarProps) {
  const t = useTranslations("TopBar");
  // An invitation is only live once it is paid for, so the unpaid ones are
  // exactly what is sitting in the cart.
  const awaitingPayment = EVENTS.filter((event) => !event.paid).length;

  return (
    <header className={`sticky top-0 z-40 ${TOP_BAR}`}>
      {/*
       * Pulled out by the 7px the glyph is inset inside its 34px hit area, so
       * the menu mark sits the same 24px off the edge as the avatar circle
       * does on the other side.
       */}
      <button
        type="button"
        onClick={onToggleNav}
        aria-expanded={navOpen}
        aria-label={t("openMenu")}
        className={`${ICON_BUTTON} -ml-[7px] nav:hidden`}
      >
        <Icon name="menu" className="size-5" />
      </button>

      {/*
       * The menu mark takes the corner once the nav collapses into it.
       * Docked, the lettering lines up with the nav's section headings: the
       * column's 20px margin and 1px border, the heading's 24px padding, less
       * this bar's own 24px padding.
       */}
      <Link
        href="/dashboard"
        aria-label="Festio"
        className="hidden items-center nav:ml-[21px] nav:flex"
      >
        {/*
         * One-colour artwork, used as a mask and filled with the current
         * nav item's `secondary-400` — a second, recoloured file would drift from
         * the original.
         */}
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
          onClick={onToggleNotices}
          aria-expanded={noticesOpen}
          aria-label={t("activityCount", { count: ATTENTION_NOTICES.length })}
          className={`${ICON_BUTTON} rail:hidden`}
        >
          <Icon name="bell" className="size-5" />
          <span aria-hidden="true" className={`${BADGE} bg-warning-400`}>
            {ATTENTION_NOTICES.length}
          </span>
        </button>

        <button
          type="button"
          aria-label={t("cart", { count: awaitingPayment })}
          className={ICON_BUTTON}
        >
          <Icon name="cart" className="size-5" />
          <span aria-hidden="true" className={`${BADGE} bg-secondary-400`}>
            {awaitingPayment}
          </span>
        </button>

        {/* Docked, held as far off the right edge as the lockup is off the left. */}
        <button
          type="button"
          aria-label={t("account")}
          className="ml-2.5 grid size-[30px] nav:mr-[21px] place-items-center rounded-full bg-secondary-400 text-xs font-semibold tracking-[0.06em] text-neutral-950 transition-colors hover:bg-secondary-300"
        >
          {HOST.initials}
        </button>
      </div>
    </header>
  );
}
