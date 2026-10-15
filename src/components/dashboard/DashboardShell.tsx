"use client";

import { useTranslations } from "next-intl";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { TopBar } from "@/components/dashboard/TopBar";

interface DashboardShellProps {
  /** Server-rendered nav, shown as a column on wide screens and a drawer below. */
  nav: ReactNode;
  /** Server-rendered notifications rail, same treatment at its own breakpoint. */
  notices: ReactNode;
  children: ReactNode;
}

type Drawer = "nav" | "notices";

/** Matches the `nav` and `rail` breakpoints where each column docks. */
const NAV_DOCKED = "(min-width: 820px)";
const RAIL_DOCKED = "(min-width: 1600px)";

/*
 * Width is deliberately left out: each drawer sets its own — the nav's
 * matches its column, the notices' is wider than theirs, as it lies over the
 * page instead of sharing it — and two `w-*` utilities on one element resolve
 * by stylesheet order rather than by the order they are written.
 */
const PANEL =
  "fixed top-topbar bottom-0 z-40 flex flex-col bg-neutral-200 shadow-[0_0_40px_rgba(47,40,31,0.2)] transition-transform duration-200 ease-out";

/**
 * A docked column is held off the top bar, the page's bottom and the
 * window's edge, and sticky inside that margin. The nav is one card; the
 * notifications rail holds a card per panel.
 */
const DOCKED = "sticky hidden shrink-0";
/** The margin: 20px all round. */
const GAP_20 =
  "top-[calc(var(--spacing-topbar)+20px)] my-5 h-[calc(100vh-var(--spacing-topbar)-40px)]";
/**
 * The nav's: 12px while the notifications are a drawer, so the nav leans
 * closer to the window's edge with no column across from it; 20px, like the
 * rail's, once they dock.
 */
const NAV_GAP =
  "ml-3 top-[calc(var(--spacing-topbar)+12px)] my-3 h-[calc(100vh-var(--spacing-topbar)-24px)] rail:ml-5 rail:top-[calc(var(--spacing-topbar)+20px)] rail:my-5 rail:h-[calc(100vh-var(--spacing-topbar)-40px)]";

export function DashboardShell({
  nav,
  notices,
  children,
}: DashboardShellProps) {
  const t = useTranslations("TopBar");
  const [open, setOpen] = useState<Drawer | null>(null);
  const navPanelRef = useRef<HTMLDivElement>(null);
  const noticesPanelRef = useRef<HTMLDivElement>(null);

  const navOpen = open === "nav";
  const noticesOpen = open === "notices";
  const anyOpen = open !== null;

  function toggle(target: Drawer) {
    setOpen((current) => (current === target ? null : target));
  }

  function close() {
    setOpen(null);
  }

  /*
   * The only way out of an open drawer is a link inside it, so closing on the
   * way through is all the route change needs. Holding the route the drawer
   * was opened on would be the other way round, and it kept the drawer coming
   * back: the record outlived the visit, so returning to that route opened a
   * menu the host had never asked for.
   */
  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a")) close();
  }

  useEffect(() => {
    if (!anyOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [anyOpen]);

  // Each drawer has a static column above its breakpoint; close it on the way
  // up so the app never holds an open drawer nobody can see.
  useEffect(() => {
    const navBreakpoint = window.matchMedia(NAV_DOCKED);
    const noticesBreakpoint = window.matchMedia(RAIL_DOCKED);
    const closeStale = () => {
      setOpen((current) => {
        if (current === "nav" && navBreakpoint.matches) return null;
        if (current === "notices" && noticesBreakpoint.matches) return null;
        return current;
      });
    };

    navBreakpoint.addEventListener("change", closeStale);
    noticesBreakpoint.addEventListener("change", closeStale);
    return () => {
      navBreakpoint.removeEventListener("change", closeStale);
      noticesBreakpoint.removeEventListener("change", closeStale);
    };
  }, []);

  useEffect(() => {
    if (open === "nav") navPanelRef.current?.focus();
    if (open === "notices") noticesPanelRef.current?.focus();
  }, [open]);

  return (
    /* While a drawer is open the page under it holds still (`globals.css`). */
    <div
      className="flex flex-1 flex-col"
      data-scroll-lock={anyOpen || undefined}
    >
      <TopBar
        navOpen={navOpen}
        noticesOpen={noticesOpen}
        onToggleNav={() => toggle("nav")}
        onToggleNotices={() => toggle("notices")}
      />

      <div className="flex flex-1 items-start">
        <aside
          className={`${DOCKED} ${NAV_GAP} side-card w-side overflow-hidden nav:block min-[1800px]:w-[272px]`}
        >
          {nav}
        </aside>

        {/*
         * Fills the width between the columns; wider screens get wider
         * margins instead of a cap. From 1200 the margins are the widest: a
         * laptop has no docked rail, and once the rail docks at 1600 it and
         * the nav are narrow until 1800, so the page keeps its room.
         */}
        <main className="min-w-0 flex-1 px-[18px] pt-6 pb-10 nav:px-8 nav:pt-6 nav:pb-10 min-[1200px]:px-12 min-[1800px]:pt-[34px] min-[1800px]:pb-[46px]">
          {children}
        </main>

        <aside
          aria-label={t("activity")}
          className={`${DOCKED} ${GAP_20} mr-5 w-rail rail:block min-[1800px]:w-[380px]`}
        >
          {notices}
        </aside>
      </div>

      {/* Shared scrim; the top bar sits above it so its toggles stay reachable. */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-x-0 top-topbar bottom-0 z-30 bg-neutral-950/35 transition-opacity duration-200 ${
          anyOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={navPanelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
        inert={!navOpen}
        onClick={closeOnLink}
        className={`${PANEL} left-0 w-side max-w-[88vw] nav:hidden ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </div>

      <div
        ref={noticesPanelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t("activity")}
        inert={!noticesOpen}
        onClick={closeOnLink}
        className={`${PANEL} right-0 w-[360px] max-w-[88vw] side-scroll overflow-y-auto px-[18px] py-5 rail:hidden ${
          noticesOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {notices}
      </div>
    </div>
  );
}
