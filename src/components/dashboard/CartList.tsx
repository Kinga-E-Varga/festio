import { useTranslations } from "next-intl";

/**
 * The side panel's cart: invitations started but not saved yet. They live
 * on the device only, never in the database; until the new-event flow keeps
 * them there, it is always empty.
 */
export function CartList() {
  const t = useTranslations("Rail");

  return <p className="muted-text">{t("cartEmpty")}</p>;
}
