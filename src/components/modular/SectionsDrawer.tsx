"use client";

import { useTranslations } from "next-intl";
import { type MouseEvent, useEffect, useEffectEvent, useRef } from "react";
import { SECTIONS_TRIGGER_ID } from "@/modular/nav";
import type { MenuLink } from "@/types/modular";

interface SectionsDrawerProps {
  open: boolean;
  links: MenuLink[];
  onClose: () => void;
}

/**
 * The narrow page's section links. Covers the invitation's root, not the
 * screen: on the guest page that is the screen, in the editor only the
 * framed box. Rendered outside the scrolling `@container` on purpose, so it
 * stays put however far the page is scrolled.
 */
export function SectionsDrawer({ open, links, onClose }: SectionsDrawerProps) {
  const t = useTranslations("Sections");
  const closeButton = useRef<HTMLButtonElement>(null);

  /* Closing hands focus back to ☰, so the guest is where they left off. */
  function close() {
    onClose();
    document
      .getElementById(SECTIONS_TRIGGER_ID)
      ?.focus({ preventScroll: true });
  }

  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  });

  /*
   * Opening moves focus into the drawer, and Esc closes it wherever focus
   * is. The page under it is `inert` meanwhile (see `ModularInvitation`).
   */
  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  /*
   * A link that unmounts in its own click never navigates — it is gone
   * before the browser follows it. So the drawer scrolls the section into
   * view itself; each section's `scroll-margin` keeps its top below the bar.
   */
  function go(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    close();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      id="sections-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={t("sections")}
      className="absolute inset-0 z-40 flex flex-col bg-[var(--m2)] px-6 py-4 text-[color:var(--m8)]"
    >
      <div className="flex items-center justify-between border-b-1 border-[var(--m5)] pb-2.5">
        <span className="text-[13px] tracking-[0.16em] uppercase text-[color:var(--m10)]">
          {t("sections")}
        </span>
        <button
          type="button"
          ref={closeButton}
          aria-label={t("closeSections")}
          onClick={close}
          className="flex size-11 items-center justify-center"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
            className="stroke-current"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <nav className="flex flex-col">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(event) => go(event, link.id)}
            className="border-b-1 border-[var(--m4)] py-3.5 text-[16px] last:border-b-0"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
