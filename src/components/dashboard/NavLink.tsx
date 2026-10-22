"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { NAV_MARGIN, SIDE_ICON } from "@/components/dashboard/styles";
import type { NavItem } from "@/types/dashboard";

/**
 * The only client-side piece of the nav: marking which destination is current
 * needs the pathname, which layouts don't receive as a prop.
 */
/** A nav item's shape, without its margins: links, the guest page and greyed pages alike. */
export const NAV_ITEM = `flex h-btn items-center gap-3 rounded-ui px-3 nav-text wide:px-4 transition-colors`;

/** A nav item that goes somewhere, and isn't the current page. */
export const NAV_HOVER = "hover:bg-secondary-400/30 hover:text-neutral-950";

interface NavLinkProps {
  item: NavItem;
  /** Its margins: inset in the nav; the side panel pulls it out to its edge. */
  margin?: string;
}

export function NavLink({ item, margin = NAV_MARGIN }: NavLinkProps) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const isCurrent = pathname === item.href;

  return (
    <Link
      href={item.href}
      aria-current={isCurrent ? "page" : undefined}
      // Shaped like the nav's Quit link; the current page takes secondary.
      className={`${margin} ${NAV_ITEM} ${
        isCurrent ? "nav-current bg-secondary-400" : NAV_HOVER
      }`}
    >
      <Icon name={item.icon} {...SIDE_ICON} />
      <span className="truncate">{t(item.labelKey)}</span>
    </Link>
  );
}
