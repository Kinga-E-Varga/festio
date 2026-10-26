"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useDismiss } from "@/components/dashboard/event-nav/useDismiss";
import { Icon } from "@/components/icons";
import {
  MENU_BOX,
  MENU_ROW,
  QUIT_ITEM,
  SIDE_ICON,
} from "@/components/dashboard/styles";
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
 * The host app's language behind one row at the docked nav's foot, built
 * like the nav's items: the globe, the current language's name, its code at
 * the end; the menu opens above it, as wide as the row.
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
        className={`${QUIT_ITEM} w-full cursor-pointer wide:px-4`}
      >
        <Icon name="globe" {...SIDE_ICON} />
        <span aria-hidden="true" className="flex-1 text-left">
          {LANGUAGE_NAMES[locale as Language]}
        </span>
        <span aria-hidden="true" className="hint-text tracking-[0.06em]">
          {t(locale as Language)}
        </span>
      </button>

      {open ? (
        <div className={`${MENU_BOX} bottom-full left-0 mb-2 w-full`}>
          <LanguageOptions onPick={close} />
        </div>
      ) : null}
    </div>
  );
}
