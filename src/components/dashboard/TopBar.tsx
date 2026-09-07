import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { ATTENTION_NOTICES, HOST } from "@/mock/dashboard";

interface TopBarProps {
  navOpen: boolean;
  noticesOpen: boolean;
  onToggleNav: () => void;
  onToggleNotices: () => void;
}

const ICON_BUTTON =
  "relative grid size-9 place-items-center rounded-md transition-colors hover:bg-sage-50";

export function TopBar({
  navOpen,
  noticesOpen,
  onToggleNav,
  onToggleNotices,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-linen-200 bg-cream-50 px-3 lg:px-5">
      <button
        type="button"
        onClick={onToggleNav}
        aria-expanded={navOpen}
        aria-label="Open dashboard menu"
        className={`${ICON_BUTTON} lg:hidden`}
      >
        <Icon name="menu" className="size-5" />
      </button>

      <Link href="/dashboard" className="flex items-center py-1">
        <Image
          src="/festio-lockup.svg"
          alt="Festio"
          width={106}
          height={24}
          priority
          className="h-6 w-auto"
        />
      </Link>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleNotices}
          aria-expanded={noticesOpen}
          aria-label={`Notifications, ${ATTENTION_NOTICES.length} need attention`}
          className={`${ICON_BUTTON} xl:hidden`}
        >
          <Icon name="bell" className="size-5" />
          <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-clay-500" />
        </button>

        <button
          type="button"
          aria-label="Cart, 1 invitation awaiting payment"
          className={ICON_BUTTON}
        >
          <Icon name="cart" className="size-5" />
          <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-brand-400 text-[10px] font-medium text-ink-900">
            1
          </span>
        </button>

        <button
          type="button"
          aria-label="Your account"
          className="grid size-8 place-items-center rounded-full bg-sage-300 text-xs font-medium text-sage-800 transition-colors hover:bg-sage-400"
        >
          {HOST.initials}
        </button>
      </div>
    </header>
  );
}
