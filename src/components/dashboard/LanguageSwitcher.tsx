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
      className="flex border border-neutral-300/25 text-[11px] tracking-[0.06em]"
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
                ? "bg-neutral-50 px-2.5 py-1 font-semibold text-neutral-900"
                : "px-2.5 py-1 text-neutral-300/70 transition-colors hover:text-neutral-50"
            }
          >
            {t(code)}
          </button>
        );
      })}
    </div>
  );
}
