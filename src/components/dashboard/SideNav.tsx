import Link from "next/link";
import { Icon } from "@/components/icons";
import { NavLink } from "@/components/dashboard/NavLink";
import { NAV_SECTIONS } from "@/mock/dashboard";

export function SideNav() {
  return (
    <nav
      aria-label="Dashboard sections"
      className="flex h-full flex-col bg-sage-50 text-ink-900"
    >
      <div className="flex-1 overflow-y-auto pb-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="pt-5 first:pt-4">
            <h2 className="px-4 pb-1.5 text-[11px] font-medium tracking-[0.14em] text-stone-500 uppercase">
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
        className="flex items-center gap-2.5 bg-sage-600 px-4 py-3 text-cream-50 transition-colors hover:bg-sage-800"
      >
        <Icon name="home" className="size-4 shrink-0" />
        <span className="font-medium">Festio home</span>
        <Icon name="arrowUpRight" className="ml-auto size-3.5" />
      </Link>
    </nav>
  );
}
