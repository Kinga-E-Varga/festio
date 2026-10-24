import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { LogoutForm } from "@/components/dashboard/LogoutForm";
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

      {/* Log out ends the session and leaves for the landing page. */}
      <LogoutForm className="mt-3 flex flex-col border-t border-neutral-200 pt-3">
        <button
          type="submit"
          className={`-mx-3 cursor-pointer wide:-mx-4 ${QUIT_ITEM} wide:px-4`}
        >
          <Icon name="logout" {...SIDE_ICON} />
          <span>{t("logout")}</span>
        </button>
      </LogoutForm>
    </div>
  );
}
