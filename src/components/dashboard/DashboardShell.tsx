"use client";

import { useTranslations } from "next-intl";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { BarActions, type BarData } from "@/components/dashboard/BarActions";
import { NAV_DOCKED } from "@/components/dashboard/media";
import { SidePanel } from "@/components/dashboard/SidePanel";
import { PAGE_GUTTER } from "@/components/dashboard/styles";
import { TopBar } from "@/components/dashboard/TopBar";
import {
  useSidePanel,
  type SidePanelView,
} from "@/components/dashboard/useSidePanel";

interface DashboardShellProps {
  /** Server-rendered nav, shown as a column on wide screens and a drawer below. */
  nav: ReactNode;
  /** Server-rendered cart, the side panel's view behind the cart icon. */
  cart: ReactNode;
  /** Server-rendered alerts, the side panel's view behind the bell. */
  alerts: ReactNode;
  /** Server-rendered latest replies, the side panel's view behind the guests icon. */
  replies: ReactNode;
  /** Server-rendered account links and Log out, the view behind the account circle. */
  account: ReactNode;
  /** The host's initials and the strip's counts. */
  bar: BarData;
  children: ReactNode;
}

/**
 * The one nav: below `nav` a drawer over the page, the full height of the
 * screen, slid out of sight and hidden (out of reach of keys and screen
 * readers) while closed; from `nav` up docked, the window's full height
 * against its left edge, sticky, in the page's colour, ruled off from it.
 * Hidden by CSS, not `inert`, so the docked nav is usable before the page
 * knows the window's width.
 */
const NAV =
  "fixed top-0 bottom-0 left-0 z-[60] flex w-side max-w-[88vw] flex-col bg-neutral-125 shadow-drawer outline-none transition-[translate,visibility] duration-200 ease-out nav:sticky nav:bottom-auto nav:z-auto nav:h-screen nav:max-w-none nav:shrink-0 nav:translate-x-0 nav:overflow-hidden nav:border-r nav:border-neutral-300 nav:shadow-none nav:transition-none wide:w-[272px]";

const SCRIM =
  "fixed inset-x-0 bottom-0 bg-neutral-950/35 transition-opacity duration-200 nav:hidden";
const SCRIM_ON = "opacity-100";
const SCRIM_OFF = "pointer-events-none opacity-0";

/**
 * From `nav` up: nav, page, strip and side panel side by side, the panel
 * squeezing the page when it opens. Below: the top bar, with the side panel
 * laid over the page under it, and the nav as a drawer over both, the full
 * height of the screen.
 */
export function DashboardShell({
  nav,
  cart,
  alerts,
  replies,
  account,
  bar,
  children,
}: DashboardShellProps) {
  const t = useTranslations("TopBar");
  const sidePanel = useSidePanel();
  const [navOpen, setNavOpen] = useState(false);
  const navPanelRef = useRef<HTMLDivElement>(null);

  /*
   * On a phone the nav drawer and the side panel would cover each other, so
   * opening one shuts the other. From `nav` up the drawer never opens.
   */
  const panel = {
    ...sidePanel,
    select: (view: SidePanelView) => {
      setNavOpen(false);
      sidePanel.select(view);
    },
  };

  function toggleNav() {
    if (!navOpen) sidePanel.close();
    setNavOpen(!navOpen);
  }

  /*
   * The only way out of the open nav drawer is a link inside it, so closing
   * on the way through is all the route change needs. Holding the route the
   * drawer was opened on would be the other way round, and it kept the drawer
   * coming back: the record outlived the visit, so returning to that route
   * opened a menu the host had never asked for.
   */
  function closeNavOnLink(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a")) setNavOpen(false);
  }

  useEffect(() => {
    if (!navOpen) return;
    navPanelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  // The nav docks as a column above its breakpoint; close its drawer on the
  // way up so the app never holds an open drawer nobody can see.
  useEffect(() => {
    const navBreakpoint = window.matchMedia(NAV_DOCKED);
    const closeStale = () => {
      if (navBreakpoint.matches) setNavOpen(false);
    };

    navBreakpoint.addEventListener("change", closeStale);
    return () => navBreakpoint.removeEventListener("change", closeStale);
  }, []);

  return (
    /* While the nav drawer is open the page under it holds still; `data-dashboard` gives the window's scrollbar this ground (both in `globals.css`). */
    <div
      className="flex flex-1 flex-col bg-neutral-125 nav:flex-row"
      data-dashboard
      data-scroll-lock={navOpen || undefined}
    >
      <TopBar
        navOpen={navOpen}
        onToggleNav={toggleNav}
        panel={panel}
        bar={bar}
      />

      <div className="flex min-w-0 flex-1 items-start">
        {/* A dialog only while it is open as the drawer, which happens only below `nav`. */}
        <div
          ref={navPanelRef}
          tabIndex={-1}
          role={navOpen ? "dialog" : undefined}
          aria-modal={navOpen || undefined}
          aria-label={navOpen ? t("menu") : undefined}
          onClick={closeNavOnLink}
          className={`${NAV} ${
            navOpen
              ? "translate-x-0"
              : "-translate-x-[calc(100%+40px)] max-nav:invisible"
          }`}
        >
          {nav}
        </div>

        {/*
         * Fills the width between the nav and the strip. Each page caps its
         * own content (`CONTENT_WIDTH`), centred under a header that spans
         * the whole width. From 1200 the margins are the widest. A container, its width kept in `--main-width` so a
         * page's bars can span all of it (`BLEED`).
         */}
        <main className="@container/main min-w-0 flex-1 pt-(--main-top) pb-10 [--main-top:--spacing(6)] wide:pb-[46px] wide:[--main-top:34px]">
          <div className={`[--main-width:100cqw] ${PAGE_GUTTER}`}>
            {children}
          </div>
        </main>
      </div>

      {/*
       * From `nav` up, the top bar's actions stand down the right side, in
       * the nav's colours and built like it (`BarActions`), as wide as the
       * event bar is tall (56px, 64px from 1800px). The side panel opens
       * beyond it, at the window's edge.
       */}
      <div className="sticky top-0 hidden h-screen w-topbar shrink-0 justify-center border-l border-neutral-300 bg-neutral-125 nav:flex wide:w-16">
        <BarActions panel={panel} bar={bar} />
      </div>

      <SidePanel panel={panel} views={{ cart, alerts, replies, account }} />

      {/*
       * The scrims, below `nav` only: a tap closes what they dim. The side
       * panel's starts under the top bar, which stays in reach; the nav
       * drawer's covers it too, as the drawer does.
       */}
      <div
        aria-hidden="true"
        onClick={sidePanel.close}
        className={`${SCRIM} top-topbar z-30 ${sidePanel.open ? SCRIM_ON : SCRIM_OFF}`}
      />
      <div
        aria-hidden="true"
        onClick={() => setNavOpen(false)}
        className={`${SCRIM} top-0 z-[55] ${navOpen ? SCRIM_ON : SCRIM_OFF}`}
      />
    </div>
  );
}
