"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import type { NavItem } from "@/types/dashboard";

/**
 * The only client-side piece of the nav: marking which destination is current
 * needs the pathname, which layouts don't receive as a prop.
 */
export function NavLink({ item }: { item: NavItem }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const isCurrent = pathname === item.href;

  return (
    <Link
      href={item.href}
      aria-current={isCurrent ? "page" : undefined}
      // Shaped like the nav's Quit link; the current page takes secondary.
      className={`mx-4 flex h-btn items-center gap-3 rounded-ui px-3 text-[13.5px] min-[1800px]:mx-6 min-[1800px]:px-4 min-[1800px]:text-[14px] transition-colors ${
        isCurrent
          ? "bg-secondary-400 font-medium text-neutral-950"
          : "hover:bg-secondary-400/30 hover:text-neutral-950"
      }`}
    >
      <Icon name={item.icon} strokeWidth={1.75} className="size-4 shrink-0" />
      <span className="truncate">{t(item.labelKey)}</span>
    </Link>
  );
}
