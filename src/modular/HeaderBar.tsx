import { useTranslations } from "next-intl";
import { SECTIONS_TRIGGER_ID } from "@/modular/nav";
import { Icon } from "@/modular/icons";
import { Mark, markParts } from "@/modular/Mark";
import { SERIF_BOLDER, FROSTED, MUTED_LINK, PILL } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

interface HeaderBarProps extends VariantProps {
  /** The variant drawing it: its mark, links and Reply button. */
  look: keyof typeof LOOKS;
}

/** The Reply button's text, the same in every variant. */
const REPLY_TEXT =
  "text-[12px] leading-[1.5] font-semibold tracking-[0.1em] uppercase";

/** The Reply button's fill. */
const ACCENT_FILL =
  "border-[var(--m-accent)] bg-[var(--m-accent)] text-[color:var(--m-accent-ink)]";
const SECONDARY_FILL =
  "border-[var(--m-secondary)] bg-[var(--m-secondary)] text-[color:var(--m-secondary-ink)]";

/*
 * The mark, in every variant: the heading face a step bolder, set tight.
 * Its optical size is pinned at 22, past Fraunces' 21.66 limit, so its
 * alternate letters (&, h, m, n, s) show at every mark size; a face without
 * an optical size ignores it.
 */
const MARK = `${SERIF_BOLDER} leading-none tracking-[-0.04em] [font-variation-settings:'opsz'_22]`;

/** Each variant's mark (size, colour), section links (look, gap), ☰ and Reply button. */
const LOOKS = {
  square: {
    mark: "text-[22px] text-[color:var(--m-accent)] @5xl:text-[24px]",
    link: MUTED_LINK,
    links: "gap-7",
    menu: "",
    // The eyebrow's look at 11px: a button, not an eyebrow.
    reply: `${REPLY_TEXT} ${ACCENT_FILL} hover:border-[var(--m-secondary)] hover:bg-[var(--m-secondary)] hover:text-[color:var(--m-secondary-ink)]`,
  },
  rounded: {
    mark: "text-[22px] text-[color:var(--m-ink)]",
    link: MUTED_LINK,
    links: "gap-7",
    // The icon sits on the bar's edge; the button keeps its 44px for a thumb.
    menu: "-mx-3",
    reply: `${REPLY_TEXT} ${SECONDARY_FILL} hover:border-[var(--m-accent)] hover:bg-[var(--m-accent)] hover:text-[color:var(--m-accent-ink)]`,
  },
};

/**
 * The header's bar, shared by its variants, which differ only in the mark,
 * the links and the Reply button; the button's corners are the host's
 * corners step, not the variant's. Sticky over the page: the mark (back to the
 * cover), the sections that have a menu label, and Reply. Below `@5xl` the
 * links move behind ☰; Reply stays in the bar at every width. Widths are the
 * column's own, so an open edit panel narrows it too.
 */
export function HeaderBar({ values, nav, look }: HeaderBarProps) {
  const t = useTranslations("Sections");
  const links = nav?.links ?? [];
  const mark = markParts(values, "mark");

  return (
    <header
      className={`${FROSTED} sticky top-0 z-20 flex h-14 items-center gap-3 border-b-1 border-[var(--m-line)] px-3 text-[color:var(--m-ink)] @5xl:h-16 @5xl:gap-8 @5xl:px-10`}
    >
      {links.length > 0 ? (
        <button
          type="button"
          aria-label={t("openSections")}
          id={SECTIONS_TRIGGER_ID}
          aria-expanded={nav?.menuOpen ?? false}
          onClick={nav?.onOpenMenu}
          className={`flex size-11 shrink-0 items-center justify-center ${LOOKS[look].menu} @5xl:hidden`}
        >
          <Icon name="menu" className="size-5" />
        </button>
      ) : null}
      {mark.length > 0 ? (
        <a
          href="#cover"
          className={`${MARK} ${LOOKS[look].mark} flex min-h-11 min-w-0 flex-1 items-center @5xl:flex-none`}
        >
          {/* Never clipped: a mark too long for a phone's bar wraps to two balanced lines, which the bar's height holds. */}
          <span className="text-balance [overflow-wrap:anywhere] leading-[1.1]">
            <Mark parts={mark} />
          </span>
        </a>
      ) : (
        // No mark: the space still holds Reply at the end on a phone.
        <span className="flex-1 @5xl:hidden" />
      )}
      <nav
        aria-label={t("sections")}
        className={`hidden flex-1 items-center justify-center ${LOOKS[look].links} @5xl:flex`}
      >
        {links.map((link) => (
          <a key={link.id} href={`#${link.id}`} className={LOOKS[look].link}>
            {link.label}
          </a>
        ))}
      </nav>
      <a
        href="#rsvp"
        className={`${LOOKS[look].reply} ${PILL} inline-flex min-h-9 shrink-0 items-center border-1 px-5 transition-colors`}
      >
        {t("rsvp")}
      </a>
    </header>
  );
}
