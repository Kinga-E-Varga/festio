import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { NavLink } from "@/components/dashboard/NavLink";
import { QUIT_ITEM, SIDE_ICON } from "@/components/dashboard/styles";
import { ACCOUNT_LINKS } from "@/mock/dashboard";

/**
 * The side panel's account view: the account's pages, shaped like the nav's
 * links, then Log out set apart by a rule. Pulled out by their inset, so the
 * icons line up with the panel's title.
 */
export function AccountList() {
  const t = useTranslations("Nav");

  return (
    <div className="text-neutral-900">
      <ul className="flex flex-col gap-1">
        {ACCOUNT_LINKS.map((item) => (
          <li key={item.href}>
            <NavLink item={item} margin="-mx-3 wide:-mx-4" />
          </li>
        ))}
      </ul>

      {/* No accounts yet, so Log out leaves for the landing page, like Quit. */}
      <div className="mt-3 border-t border-neutral-200 pt-3">
        <Link href="/" className={`-mx-3 wide:-mx-4 ${QUIT_ITEM} wide:px-4`}>
          <Icon name="logout" {...SIDE_ICON} />
          <span>{t("logout")}</span>
        </Link>
      </div>
    </div>
  );
}
