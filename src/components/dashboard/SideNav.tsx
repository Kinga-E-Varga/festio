import Link from "next/link";
import { Icon } from "@/components/icons";
import { NavLink } from "@/components/dashboard/NavLink";
import { NAV_SECTIONS } from "@/mock/dashboard";

export function SideNav() {
  return (
    <nav
      aria-label="Dashboard sections"
      className="flex h-full flex-col bg-mustard-100 pb-4 text-neutral-900"
    >
      <div className="min-h-0 flex-1 overflow-y-auto pt-[22px] pb-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="pb-[22px] last:pb-0">
            <h2 className="px-6 pb-2 text-[10px] font-semibold tracking-[0.18em] text-mustard-500 uppercase">
              {section.label}
            </h2>
            <ul>
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="mx-4 flex items-center gap-3 rounded-[10px] bg-mustard-300 px-4 py-[13px] font-semibold text-neutral-900 transition-colors hover:bg-mustard-500"
      >
        <Icon name="arrowUpRight" className="size-[17px] shrink-0" />
        <span>Quit dashboard</span>
      </Link>
    </nav>
  );
}
