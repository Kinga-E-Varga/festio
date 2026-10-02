import { useTranslations } from "next-intl";
import { formatDeadline, replyClose } from "@/lib/event";
import { hostInitials, text } from "@/modular/content";
import { SECTIONS_TRIGGER_ID } from "@/modular/nav";
import { HEADING } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Sticky over the page: the host's mark (their initials unless they wrote
 * one), the sections that have a menu label, when replies close, and RSVP.
 * On a narrow page the links move behind ☰; RSVP stays in the bar at every
 * width. Widths are the page's own (container queries), so an open edit
 * panel narrows it too.
 */
export function Variant({ values, basics, language, nav }: VariantProps) {
  const t = useTranslations("Sections");
  const mark = text(values, "mark") || hostInitials(basics);
  const closes = formatDeadline(replyClose({ date: basics.date }), language);
  const links = nav?.links ?? [];

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b-1 border-[var(--m5)] bg-[var(--m1)] px-4 text-[color:var(--m8)] @5xl:h-16 @5xl:gap-8 @5xl:px-14">
      {links.length > 0 ? (
        <button
          type="button"
          aria-label={t("openSections")}
          id={SECTIONS_TRIGGER_ID}
          aria-expanded={nav?.menuOpen ?? false}
          onClick={nav?.onOpenMenu}
          className="flex size-11 shrink-0 items-center justify-center @5xl:hidden"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
            className="stroke-current"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      ) : null}
      <span
        className={`${HEADING} flex-1 text-[15px] @5xl:flex-none @5xl:text-[16px]`}
      >
        {mark}
      </span>
      <span
        aria-hidden="true"
        className="hidden h-5 w-px bg-[var(--m5)] @5xl:block"
      />
      <nav
        aria-label={t("sections")}
        className="hidden flex-1 gap-[22px] @5xl:flex"
      >
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="text-[13px] text-[color:var(--m9)] transition-colors hover:text-[color:var(--m13)]"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <span className="hidden text-[13px] text-[color:var(--m10)] @5xl:block">
        {t("repliesClose", { date: closes })}
      </span>
      <a
        href="#rsvp"
        className="inline-flex min-h-11 shrink-0 items-center bg-[var(--m13)] px-[18px] text-[13px] font-semibold tracking-[0.04em] text-[color:var(--m1)] transition-opacity hover:opacity-85 @5xl:px-6"
      >
        {t("rsvp")}
      </a>
    </header>
  );
}
