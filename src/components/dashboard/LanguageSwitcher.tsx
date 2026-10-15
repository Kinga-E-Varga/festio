"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * Switches the host app's own language, independent of any invitation's
 * `language` field. Keeps the current page, just re-resolved under the new
 * locale prefix (or unprefixed, for English).
 */
export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex overflow-hidden rounded-ui border border-secondary-500 text-[11px] tracking-[0.06em]"
    >
      {routing.locales.map((code) => {
        const isCurrent = code === locale;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={isCurrent}
            onClick={() => router.replace(pathname, { locale: code })}
            className={
              isCurrent
                ? "bg-primary-900 px-2.5 py-1 font-semibold text-neutral-100"
                : "px-2.5 py-1 text-neutral-950 transition-colors hover:text-primary-900"
            }
          >
            {t(code)}
          </button>
        );
      })}
    </div>
  );
}
