"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import {
  COUNT,
  countedViews,
  type BarData,
} from "@/components/dashboard/BarActions";
import { useDismiss } from "@/components/dashboard/event-nav/useDismiss";
import { LanguageOptions } from "@/components/dashboard/LanguageMenu";
import { SIDE_PANEL_ID } from "@/components/dashboard/SidePanel";
import {
  BAR_ICON,
  MENU_BOX,
  MENU_ROW,
  SIDE_ICON,
  TOP_BAR_CIRCLE,
  TOP_BAR_ICON,
} from "@/components/dashboard/styles";
import type { SidePanel } from "@/components/dashboard/useSidePanel";
import { Icon, FoldChevron } from "@/components/icons";
import type { Language } from "@/lib/language";

/**
 * The phone's top bar keeps only the menu and the account; cart, alerts,
 * latest replies and language fold into this one button, beside the account.
 * Their counts show in the menu, not on the button. Each view opens the side
 * panel. Language is one row, the current code at its end, folding the
 * languages out under it: it is rarely needed, so it never takes half the
 * menu.
 */
export function MoreMenu({ panel, bar }: { panel: SidePanel; bar: BarData }) {
  const t = useTranslations("TopBar");
  const tLanguage = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    setLanguages(false);
  }, []);
  useDismiss(open, rootRef, close);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("more")}
        onClick={() => (open ? close() : setOpen(true))}
        className={`${BAR_ICON} ${TOP_BAR_CIRCLE}`}
      >
        <Icon name="more" {...TOP_BAR_ICON} />
      </button>

      {open ? (
        <div className={`${MENU_BOX} top-full right-0 mt-1 w-60`}>
          <ul>
            {countedViews(bar).map((each) => (
              <li key={each.view}>
                <button
                  type="button"
                  aria-controls={SIDE_PANEL_ID}
                  aria-label={
                    each.count
                      ? t(each.count.key, { count: each.count.value })
                      : t(each.view)
                  }
                  onClick={() => {
                    close();
                    panel.select(each.view);
                  }}
                  className={MENU_ROW}
                >
                  <Icon name={each.icon} {...SIDE_ICON} />
                  <span className="flex-1">{t(each.view)}</span>
                  {each.count ? (
                    <span aria-hidden="true" className={COUNT}>
                      {each.count.value}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-1 border-t border-neutral-200 pt-1">
            <button
              type="button"
              aria-expanded={languages}
              onClick={() => setLanguages(!languages)}
              className={MENU_ROW}
            >
              <Icon name="globe" {...SIDE_ICON} />
              <span className="flex-1">{tLanguage("label")}</span>
              <span className="hint-text tracking-[0.06em]">
                {tLanguage(locale as Language)}
              </span>
              <FoldChevron open={languages} />
            </button>
            {languages ? (
              <div className="pl-[30px]">
                <LanguageOptions onPick={close} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
