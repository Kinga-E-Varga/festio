"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useDismiss } from "@/components/dashboard/event-nav/useDismiss";
import { BAR_ICON, MENU_BOX, MENU_ROW } from "@/components/dashboard/styles";
import { LANGUAGE_NAMES, type Language } from "@/lib/language";

/**
 * Every language, each named in its own language, so it reads to whoever
 * needs it. Picking one keeps the current page, re-resolved under the new
 * locale. The language menu's list and the phone's More menu's.
 */
export function LanguageOptions({ onPick }: { onPick: () => void }) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ul>
      {routing.locales.map((code) => {
        const isCurrent = code === locale;
        return (
          <li key={code}>
            <button
              type="button"
              lang={code}
              aria-current={isCurrent || undefined}
              onClick={() => {
                onPick();
                if (!isCurrent) router.replace(pathname, { locale: code });
              }}
              className={`${MENU_ROW} justify-between ${
                isCurrent ? "font-semibold text-neutral-950" : ""
              }`}
            >
              {LANGUAGE_NAMES[code]}
              <span className="hint-text tracking-[0.06em]">{t(code)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The host app's language behind one button at the right-hand strip's foot:
 * the current language's code, the menu opening to its left.
 */
export function LanguageMenu() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, rootRef, close);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${t("label")}: ${LANGUAGE_NAMES[locale as Language]}`}
        onClick={() => setOpen((current) => !current)}
        className={BAR_ICON}
      >
        <span aria-hidden="true" className="button-text">
          {t(locale as Language)}
        </span>
      </button>

      {open ? (
        <div className={`${MENU_BOX} right-full bottom-0 mr-2 w-36`}>
          <LanguageOptions onPick={close} />
        </div>
      ) : null}
    </div>
  );
}
