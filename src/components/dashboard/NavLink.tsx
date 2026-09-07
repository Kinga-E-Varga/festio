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
      className={`flex items-center gap-2.5 border-l-2 px-4 py-2 transition-colors ${
        isCurrent
          ? "border-sage-600 bg-sage-100 font-medium text-sage-800"
          : "border-transparent hover:bg-sage-100/60"
      }`}
    >
      <Icon
        name={item.icon}
        className={`size-4 shrink-0 ${
          isCurrent ? "text-sage-600" : "text-stone-500"
        }`}
      />
      <span className="truncate">{item.label}</span>
      {item.badge ? (
        <span className="ml-auto text-xs text-stone-500 tabular-nums">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
