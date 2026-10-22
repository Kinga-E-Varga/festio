import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { eventPath, formatDay, SHORT_DATE_PARTS } from "@/lib/event";
import type { Language } from "@/lib/language";
import { PACKAGES, UNPAID_EVENTS } from "@/mock/dashboard";
import { BOX_ROW } from "@/components/dashboard/styles";

/**
 * The side panel's cart: every event waiting for payment, its package and
 * price, then the total. Each opens its Overview, where the event's box
 * pays for it.
 */
export function CartList() {
  const t = useTranslations("Rail");
  const tPackages = useTranslations("Packages");
  const locale = useLocale() as Language;
  const unpaid = UNPAID_EVENTS;
  const total = unpaid.reduce(
    (sum, event) => sum + PACKAGES[event.package].price,
    0,
  );

  if (unpaid.length === 0) {
    return <p className="muted-text">{t("cartEmpty")}</p>;
  }

  return (
    <div>
      <ul>
        {unpaid.map((event) => (
          <li key={event.id} className={BOX_ROW}>
            <Link
              href={eventPath(event.id)}
              className="-mx-3 flex items-baseline justify-between gap-4 rounded-ui px-3 py-2.5 transition-colors hover:bg-secondary-400/30 wide:py-3"
            >
              <span className="min-w-0 panel-text leading-[1.45]">
                <span className="block truncate strong-text">
                  {event.title}
                </span>
                <span className="mt-0.5 block hint-text">
                  {[
                    formatDay(event.date, locale, SHORT_DATE_PARTS),
                    tPackages(`${event.package}.name`),
                  ].join(" · ")}
                </span>
              </span>
              <span className="shrink-0 panel-face strong-text">
                {tPackages("price", {
                  amount: PACKAGES[event.package].price,
                })}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-3 flex items-baseline justify-between gap-4 border-t border-neutral-200 pt-3 panel-text">
        <span>{t("cartTotal")}</span>
        <span className="strong-text">
          {tPackages("price", { amount: total })}
        </span>
      </p>
      <p className="mt-3 hint-text">{t("cartHint")}</p>
    </div>
  );
}
