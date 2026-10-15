import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { NavLink } from "@/components/dashboard/NavLink";
import { SIDE_CARD_TITLE } from "@/components/dashboard/styles";
import { NAV_SECTIONS } from "@/mock/dashboard";

export function SideNav() {
  const t = useTranslations("Nav");

  return (
    <nav
      aria-label={t("aria")}
      className="flex h-full flex-col bg-neutral-200 pb-5 text-neutral-900 min-[1800px]:pb-7"
    >
      <div className="min-h-0 flex-1 overflow-y-auto pt-5 pb-3 min-[1800px]:pt-7">
        {NAV_SECTIONS.map((section) => (
          <div key={section.labelKey} className="pb-5 last:pb-0">
            <h2
              className={`px-5 pb-4 min-[1800px]:px-[30px] ${SIDE_CARD_TITLE}`}
            >
              {t(section.labelKey)}
            </h2>
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Leaving is rare, so it reads as a nav item, set apart by a rule. */}
      <div className="mx-4 border-t border-neutral-400 pt-3 min-[1800px]:mx-6">
        <Link
          href="/"
          className="flex h-btn items-center gap-3 rounded-ui px-3 text-[13.5px] min-[1800px]:px-4 min-[1800px]:text-[14px] transition-colors hover:bg-secondary-400/30 hover:text-neutral-950"
        >
          <Icon
            name="quit"
            strokeWidth={1.75}
            className="size-4 shrink-0 [stroke-linecap:square] [stroke-linejoin:miter]"
          />
          <span>{t("quit")}</span>
        </Link>
      </div>
    </nav>
  );
}
