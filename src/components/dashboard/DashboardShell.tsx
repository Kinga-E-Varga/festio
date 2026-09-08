"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/dashboard/TopBar";

interface DashboardShellProps {
  /** Server-rendered nav, shown as a column on wide screens and a drawer below. */
  nav: ReactNode;
  /** Server-rendered notifications rail, same treatment at its own breakpoint. */
  notices: ReactNode;
  children: ReactNode;
}

type Drawer = "nav" | "notices";

interface DrawerState {
  open: Drawer | null;
  /** Route the drawer was opened on; a different route means it is stale. */
  path: string;
}

/** Matches the `nav` and `rail` breakpoints where each column docks. */
const NAV_DOCKED = "(min-width: 820px)";
const RAIL_DOCKED = "(min-width: 1400px)";

/*
 * Width is deliberately left out: each drawer sets its own to match the column
 * it stands in for, and two `w-*` utilities on one element resolve by
 * stylesheet order rather than by the order they are written.
 */
const PANEL =
  "fixed top-topbar bottom-0 z-40 flex flex-col bg-mustard-100 shadow-[0_0_40px_rgba(47,40,31,0.2)] transition-transform duration-200 ease-out";

export function DashboardShell({
  nav,
  notices,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState<DrawerState>({
    open: null,
    path: pathname,
  });
  const navPanelRef = useRef<HTMLDivElement>(null);
  const noticesPanelRef = useRef<HTMLDivElement>(null);

  // Deriving from the pathname rather than resetting it in an effect means
  // picking a destination in a drawer leaves the drawer behind for free.
  const current = drawer.path === pathname ? drawer.open : null;
  const navOpen = current === "nav";
  const noticesOpen = current === "notices";

  function toggle(target: Drawer) {
    setDrawer({ open: current === target ? null : target, path: pathname });
  }

  function close() {
    setDrawer({ open: null, path: pathname });
  }

  useEffect(() => {
    if (!navOpen && !noticesOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer({ open: null, path: pathname });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navOpen, noticesOpen, pathname]);

  // Each drawer has a static column above its breakpoint; close it on the way
  // up so the app never holds an open drawer nobody can see.
  useEffect(() => {
    const navBreakpoint = window.matchMedia(NAV_DOCKED);
    const noticesBreakpoint = window.matchMedia(RAIL_DOCKED);
    const closeStale = () => {
      setDrawer((state) => {
        if (state.open === "nav" && navBreakpoint.matches) {
          return { open: null, path: state.path };
        }
        if (state.open === "notices" && noticesBreakpoint.matches) {
          return { open: null, path: state.path };
        }
        return state;
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
    if (navOpen) navPanelRef.current?.focus();
  }, [navOpen]);

  useEffect(() => {
    if (noticesOpen) noticesPanelRef.current?.focus();
  }, [noticesOpen]);

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        navOpen={navOpen}
        noticesOpen={noticesOpen}
        onToggleNav={() => toggle("nav")}
        onToggleNotices={() => toggle("notices")}
      />

      <div className="flex flex-1 items-start">
        <aside className="sticky top-topbar hidden h-[calc(100vh-var(--spacing-topbar))] w-side shrink-0 border-r border-mustard-300 nav:block">
          {nav}
        </aside>

        <main className="min-w-0 flex-1 px-[18px] pt-6 pb-10 nav:px-8 nav:pt-[34px] nav:pb-[46px]">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>

        <aside
          aria-label="Activity"
          className="sticky top-topbar hidden h-[calc(100vh-var(--spacing-topbar))] w-rail shrink-0 overflow-y-auto border-l border-mustard-300 bg-mustard-100 px-[18px] py-5 rail:block"
        >
          {notices}
        </aside>
      </div>

      {/* Shared scrim; the top bar sits above it so its toggles stay reachable. */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-x-0 top-topbar bottom-0 z-30 bg-neutral-900/35 transition-opacity duration-200 ${
          navOpen || noticesOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={navPanelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard menu"
        inert={!navOpen}
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
        aria-label="Activity"
        inert={!noticesOpen}
        className={`${PANEL} right-0 w-rail max-w-[88vw] overflow-y-auto px-[18px] py-5 rail:hidden ${
          noticesOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {notices}
      </div>
    </div>
  );
}
