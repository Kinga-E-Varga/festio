import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { LogoutForm } from "@/components/dashboard/LogoutForm";
import { NavLink } from "@/components/dashboard/NavLink";
import { QUIT_ITEM, SIDE_ICON } from "@/components/dashboard/styles";
import { ACCOUNT_LINKS, DASHBOARD_LINK } from "@/mock/dashboard";

/** Pulled out to the panel's padding, so the icons line up with its title. */
const EDGE = "-mx-3 wide:-mx-4";

/**
 * The side panel's account view: the account's pages, shaped like the nav's
 * links, then Log out set apart by a rule. `dashboard`: Dashboard heads it,
 * under a rule of its own, for the landing bar's account menu.
 */

export function AccountList({ dashboard = false }: { dashboard?: boolean }) {
  const t = useTranslations("Nav");

  return (
    <div className="text-neutral-900">
      {/* Where to go first, set apart from the account's own pages by the same rule as Log out. */}
      {dashboard ? (
        <div className="mb-3 border-b border-neutral-200 pb-3">
          <NavLink item={DASHBOARD_LINK} margin={EDGE} />
        </div>
      ) : null}

      <ul className="flex flex-col gap-1">
        {ACCOUNT_LINKS.map((item) => (
          <li key={item.href}>
            <NavLink item={item} margin={EDGE} />
          </li>
        ))}
      </ul>

      {/* Log out ends the session and leaves for the landing page. */}
      <LogoutForm className="mt-3 flex flex-col border-t border-neutral-200 pt-3">
        <button
          type="submit"
          className={`${EDGE} cursor-pointer ${QUIT_ITEM} wide:px-4`}
        >
          <Icon name="logout" {...SIDE_ICON} />
          <span>{t("logout")}</span>
        </button>
      </LogoutForm>
    </div>
  );
}
