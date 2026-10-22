"use client";

import { useTranslations } from "next-intl";
import type { MouseEvent, ReactNode } from "react";
import { Icon } from "@/components/icons";
import { NAV_DOCKED } from "@/components/dashboard/media";
import { STRIP_ICON, BAR_ICON } from "@/components/dashboard/styles";
import type {
  SidePanel as SidePanelState,
  SidePanelView,
} from "@/components/dashboard/useSidePanel";

/** The id the bar's icons point at (`aria-controls`). */
export const SIDE_PANEL_ID = "side-panel";

interface SidePanelProps {
  panel: SidePanelState;
  /** Server-rendered content for each view. */
  views: Record<SidePanelView, ReactNode>;
}

/*
 * Phones: laid over the page under the top bar, sliding in from the edge;
 * up to 480px it takes the whole width, as a sliver of page beside it is
 * no use.
 * From `nav` up: part of the row at the window's right edge, its width
 * opening from 0, so the page narrows and the strip moves over with it.
 * Each breakpoint keeps its own way of hiding — the slide below, the width
 * above — so neither has to undo the other's. Below, a closed panel goes its
 * shadow's 40px further than its width, or the shadow shows at the edge.
 * 300ms, easing in and out (a soft start and a soft stop), so the
 * page narrowing beside it reads as one glide rather than a jump.
 */
const PLACE =
  "fixed top-topbar right-0 bottom-0 z-40 w-drawer max-w-[88vw] max-[480px]:w-full max-[480px]:max-w-none shadow-drawer transition-[translate] duration-300 ease-panel nav:sticky nav:top-0 nav:bottom-auto nav:z-auto nav:h-screen nav:max-w-none nav:shrink-0 nav:translate-x-0 nav:overflow-hidden nav:shadow-none nav:transition-[width]";

export function SidePanel({ panel, views }: SidePanelProps) {
  const t = useTranslations("TopBar");

  /*
   * On a phone the panel covers the page, so following one of its links
   * closes it on the way; beside the page it stays, like the nav does.
   */
  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if (!(event.target as HTMLElement).closest("a")) return;
    if (!window.matchMedia(NAV_DOCKED).matches) panel.close();
  }

  /*
   * The X sits inside the panel, which goes inert as it closes, so focus goes
   * back to the icon that opened it — the one on show, top bar or strip.
   */
  function closeToOpener() {
    const opener = Array.from(
      document.querySelectorAll<HTMLElement>(
        `[aria-controls="${SIDE_PANEL_ID}"][aria-expanded="true"]`,
      ),
    ).find((button) => button.offsetParent !== null);
    panel.close();
    opener?.focus();
  }

  return (
    <aside
      id={SIDE_PANEL_ID}
      aria-label={t(panel.view)}
      inert={!panel.open}
      onClick={closeOnLink}
      className={`${PLACE} ${
        panel.open
          ? "translate-x-0 nav:w-drawer"
          : "translate-x-[calc(100%+40px)] nav:w-0"
      }`}
    >
      {/*
       * Always the drawer's full width, so the content holds its layout while
       * the width around it opens and closes.
       */}
      <div className="flex h-full w-drawer max-w-[88vw] flex-col border-l border-neutral-300 bg-neutral-50 max-[480px]:w-full max-[480px]:max-w-none max-[480px]:border-l-0 nav:max-w-none nav:border-l-0">
        {/*
         * Laid out like the strip beside it: the title's row, as tall as the
         * X (36px), where the account circle sits (its top padding); the
         * content starting where the strip's buttons do (the same padding
         * again under it).
         */}
        <header className="flex shrink-0 items-center justify-between gap-3 pt-chrome-top pr-2.5 pl-[18px]">
          <h2 className="card-title">{t(panel.view)}</h2>
          <button
            type="button"
            onClick={closeToOpener}
            aria-label={t("closePanel")}
            className={BAR_ICON}
          >
            <Icon name="close" {...STRIP_ICON} />
          </button>
        </header>

        <div className="side-scroll min-h-0 flex-1 overflow-y-auto px-[18px] pt-chrome-top pb-5 [--scroll-track:var(--color-neutral-50)]">
          {views[panel.view]}
        </div>
      </div>
    </aside>
  );
}
