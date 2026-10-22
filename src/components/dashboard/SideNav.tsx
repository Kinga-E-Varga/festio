import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { NavLink } from "@/components/dashboard/NavLink";
import { EventNav } from "@/components/dashboard/event-nav/EventNav";
import {
  NAV_MARGIN,
  QUIT_ITEM,
  QUIT_RULE,
  SIDE_ICON,
  LOCKUP,
} from "@/components/dashboard/styles";
import { NAV_ITEMS } from "@/mock/dashboard";
import type { PickerEvent } from "@/types/dashboard";

interface SideNavProps {
  /** Every event, soonest first, for the picker. */
  events: PickerEvent[];
  /** The event picked on an earlier visit. */
  storedEventId?: string;
}

export function SideNav({ events, storedEventId }: SideNavProps) {
  const t = useTranslations("Nav");

  return (
    <nav
      aria-label={t("aria")}
      className="flex h-full flex-col bg-neutral-125 pb-5 text-neutral-900 wide:pb-7"
    >
      {/*
       * The nav heads with the logo, docked and in the phone's drawer; in the
       * drawer, centred in a row as tall as the top bar it covers.
       */}
      <Link
        href="/dashboard"
        aria-label="Festio"
        className="flex h-topbar shrink-0 items-center px-[22px] nav:h-auto nav:pt-chrome-top wide:px-[26px]"
      >
        <span
          aria-hidden="true"
          className={`h-[30px] bg-primary-800 nav:h-btn ${LOCKUP}`}
        />
      </Link>

      {/*
       * Docked, Home as far under the logo as the logo is from the top: 20px
       * (28px from 1800px). In the drawer, where the logo has its own 56px
       * row, the same 12px above Home as below it.
       */}
      <div className="side-scroll min-h-0 flex-1 overflow-y-auto pt-3 [--scroll-track:var(--color-neutral-125)] pb-3 nav:pt-chrome-top">
        <ul className="flex flex-col gap-1 pb-3">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink item={item} />
            </li>
          ))}
        </ul>

        {/* The event being worked on, and its pages. */}
        <EventNav events={events} storedEventId={storedEventId} />
      </div>

      {/* Leaving is rare, so it reads as a nav item, set apart by a rule. */}
      <div className={`${NAV_MARGIN} ${QUIT_RULE}`}>
        <Link href="/" className={`${QUIT_ITEM} wide:px-4`}>
          <Icon name="quit" {...SIDE_ICON} />
          <span>{t("quit")}</span>
        </Link>
      </div>
    </nav>
  );
}
