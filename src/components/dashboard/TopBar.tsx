import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { ATTENTION_NOTICES, EVENTS, HOST } from "@/mock/dashboard";

interface TopBarProps {
  navOpen: boolean;
  noticesOpen: boolean;
  onToggleNav: () => void;
  onToggleNotices: () => void;
}

const ICON_BUTTON =
  "relative grid size-[38px] place-items-center rounded-full text-mustard-50 transition-colors hover:bg-mustard-50/15";

/** Count bubbles on the bell and the cart share everything but their colour. */
const BADGE =
  "absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-semibold text-mustard-50";

export function TopBar({
  navOpen,
  noticesOpen,
  onToggleNav,
  onToggleNotices,
}: TopBarProps) {
  // An invitation is only live once it is paid for, so the unpaid ones are
  // exactly what is sitting in the cart.
  const awaitingPayment = EVENTS.filter((event) => !event.paid).length;

  return (
    <header className="sticky top-0 z-40 flex h-topbar shrink-0 items-center gap-3.5 border-b border-mustard-500 bg-neutral-900 px-6">
      {/*
       * Pulled out by the 8px the glyph is inset inside its 38px hit area, so
       * the menu mark sits the same 24px off the edge as the avatar circle
       * does on the other side.
       */}
      <button
        type="button"
        onClick={onToggleNav}
        aria-expanded={navOpen}
        aria-label="Open dashboard menu"
        className={`${ICON_BUTTON} -ml-2 nav:hidden`}
      >
        <Icon name="menu" className="size-[22px]" />
      </button>

      {/* The menu mark takes the corner once the nav collapses into it. */}
      <Link href="/dashboard" className="hidden items-center nav:flex">
        {/*
         * One-colour artwork, so inverting it is cheaper than shipping a
         * second file that would drift from the original.
         */}
        <Image
          src="/festio-lockup.svg"
          alt="Festio"
          width={148}
          height={32}
          priority
          className="h-7 w-auto brightness-0 invert"
        />
      </Link>

      {/*
       * Bell and cart pair up tightly. The gap looks smaller than it reads:
       * each 22px glyph carries 8px of hit area either side, so 4px here is
       * 20px of visible space between the two marks.
       */}
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleNotices}
          aria-expanded={noticesOpen}
          aria-label={`Activity, ${ATTENTION_NOTICES.length} items need attention`}
          className={`${ICON_BUTTON} rail:hidden`}
        >
          <Icon name="bell" className="size-[22px]" />
          <span aria-hidden="true" className={`${BADGE} bg-rust-500`}>
            {ATTENTION_NOTICES.length}
          </span>
        </button>

        <button
          type="button"
          aria-label={`Cart, ${awaitingPayment} ${
            awaitingPayment === 1 ? "invitation" : "invitations"
          } awaiting payment`}
          className={ICON_BUTTON}
        >
          <Icon name="cart" className="size-[22px]" />
          <span aria-hidden="true" className={`${BADGE} bg-terracotta-500`}>
            {awaitingPayment}
          </span>
        </button>

        <button
          type="button"
          aria-label="Your account"
          className="ml-2.5 grid size-[34px] place-items-center rounded-full bg-mustard-500 text-xs font-semibold tracking-[0.06em] text-neutral-950 transition-colors hover:bg-mustard-400"
        >
          {HOST.initials}
        </button>
      </div>
    </header>
  );
}
