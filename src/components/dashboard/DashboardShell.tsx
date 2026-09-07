"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { TopBar } from "@/components/dashboard/TopBar";

interface DashboardShellProps {
  /** Server-rendered nav, shown as a column on large screens and a drawer below. */
  nav: ReactNode;
  /** Server-rendered notifications rail, same treatment at the xl breakpoint. */
  notices: ReactNode;
  children: ReactNode;
}

type Drawer = "nav" | "notices";

interface DrawerState {
  open: Drawer | null;
  /** Route the drawer was opened on; a different route means it is stale. */
  path: string;
}

const DRAWER_HEADER =
  "flex h-14 shrink-0 items-center justify-between border-b border-linen-200 px-4";
const DRAWER_LABEL =
  "text-[11px] font-medium tracking-[0.14em] text-stone-500 uppercase";
const DRAWER_CLOSE =
  "grid size-9 place-items-center rounded-md transition-colors hover:bg-sage-100";

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
  const navCloseRef = useRef<HTMLButtonElement>(null);
  const noticesCloseRef = useRef<HTMLButtonElement>(null);

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
    const navBreakpoint = window.matchMedia("(min-width: 64rem)");
    const noticesBreakpoint = window.matchMedia("(min-width: 80rem)");
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
    if (navOpen) navCloseRef.current?.focus();
  }, [navOpen]);

  useEffect(() => {
    if (noticesOpen) noticesCloseRef.current?.focus();
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
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r border-linen-200 lg:block">
          {nav}
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <aside
          aria-label="Notifications"
          className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-76 shrink-0 overflow-y-auto border-l border-linen-200 px-4 py-5 xl:block"
        >
          {notices}
        </aside>
      </div>

      <div className="lg:hidden">
        <div
          aria-hidden="true"
          onClick={close}
          className={`fixed inset-0 z-40 bg-ink-900/40 transition-opacity duration-200 ${
            navOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard menu"
          inert={!navOpen}
          className={`fixed top-0 left-0 z-50 flex h-full w-68 max-w-[85vw] flex-col border-r border-linen-200 bg-sage-50 transition-transform duration-200 ease-out ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className={DRAWER_HEADER}>
            <span className={DRAWER_LABEL}>Menu</span>
            <button
              ref={navCloseRef}
              type="button"
              onClick={close}
              aria-label="Close menu"
              className={DRAWER_CLOSE}
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1">{nav}</div>
        </div>
      </div>

      <div className="xl:hidden">
        <div
          aria-hidden="true"
          onClick={close}
          className={`fixed inset-0 z-40 bg-ink-900/40 transition-opacity duration-200 ${
            noticesOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Notifications"
          inert={!noticesOpen}
          className={`fixed top-0 right-0 z-50 flex h-full w-84 max-w-[90vw] flex-col border-l border-linen-200 bg-cream-100 transition-transform duration-200 ease-out ${
            noticesOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className={DRAWER_HEADER}>
            <span className={DRAWER_LABEL}>Notifications</span>
            <button
              ref={noticesCloseRef}
              type="button"
              onClick={close}
              aria-label="Close notifications"
              className={DRAWER_CLOSE}
            >
              <Icon name="close" className="size-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {notices}
          </div>
        </div>
      </div>
    </div>
  );
}
