import { useTranslations } from "next-intl";
import { AmpersandText } from "@/modular/AmpersandText";
import { markOf } from "@/modular/content";
import { SECTIONS_TRIGGER_ID } from "@/modular/nav";
import { Icon } from "@/modular/icons";
import {
  AMPERSAND,
  DISPLAY,
  EYEBROW,
  FROSTED,
  MUTED_LINK,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * Sticky over the page: the mark (back to the cover), the sections that have
 * a menu label, and Respond. Below `@5xl` the links move behind ☰; Respond stays
 * in the bar at every width. Widths are the column's own, so an open edit
 * panel narrows it too.
 */
export function Variant({ values, basics, nav }: VariantProps) {
  const t = useTranslations("Sections");
  const links = nav?.links ?? [];

  return (
    <header
      className={`${FROSTED} sticky top-0 z-20 flex h-14 items-center gap-3 border-b-1 border-[var(--m-line)] px-4 text-[color:var(--m-ink)] @5xl:h-16 @5xl:gap-8 @5xl:px-14`}
    >
      {links.length > 0 ? (
        <button
          type="button"
          aria-label={t("openSections")}
          id={SECTIONS_TRIGGER_ID}
          aria-expanded={nav?.menuOpen ?? false}
          onClick={nav?.onOpenMenu}
          className="flex size-11 shrink-0 items-center justify-center @5xl:hidden"
        >
          <Icon name="menu" className="size-5" />
        </button>
      ) : null}
      <a
        href="#cover"
        className={`${DISPLAY} flex min-h-11 min-w-0 flex-1 items-center text-[22px] @5xl:flex-none @5xl:text-[24px]`}
      >
        <span className="truncate">
          <AmpersandText text={markOf(values, basics)} className={AMPERSAND} />
        </span>
      </a>
      <nav
        aria-label={t("sections")}
        className="hidden flex-1 justify-center gap-7 @5xl:flex"
      >
        {links.map((link) => (
          <a key={link.id} href={`#${link.id}`} className={MUTED_LINK}>
            {link.label}
          </a>
        ))}
      </nav>
      <a
        href="#rsvp"
        className={`${EYEBROW} inline-flex min-h-10 shrink-0 items-center border-1 border-[var(--m-accent)] bg-[var(--m-accent)] px-5 text-[color:var(--m-accent-ink)] transition-colors hover:border-[var(--m-secondary)] hover:bg-[var(--m-secondary)] hover:text-[color:var(--m-secondary-ink)]`}
      >
        {t("rsvp")}
      </a>
    </header>
  );
}
