"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import type { NavItem } from "@/types/dashboard";

/**
 * The only client-side piece of the nav: marking which destination is current
 * needs the pathname, which layouts don't receive as a prop.
 */
export function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isCurrent = pathname === item.href;

  return (
    <Link
      href={item.href}
      aria-current={isCurrent ? "page" : undefined}
      // The left edge is always four pixels wide, so hovering colours it in
      // rather than shifting the label sideways.
      className={`flex items-center gap-3 border-l-4 py-[9px] pr-6 pl-5 transition-colors ${
        isCurrent
          ? "border-transparent bg-forest-500 font-semibold text-neutral-50"
          : "border-transparent hover:border-forest-500 hover:bg-forest-200"
      }`}
    >
      <Icon name={item.icon} className="size-[17px] shrink-0" />
      <span className="truncate">{item.label}</span>
      {item.badge ? (
        <span
          className={`ml-auto text-xs tabular-nums ${
            isCurrent ? "text-forest-200" : "text-neutral-700"
          }`}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
