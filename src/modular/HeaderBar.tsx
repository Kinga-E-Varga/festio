import { useTranslations } from "next-intl";
import { SECTIONS_TRIGGER_ID } from "@/modular/nav";
import { Icon } from "@/modular/icons";
import { Mark, markParts } from "@/modular/Mark";
import { AMPERSAND_INK, MUTED_LINK, PILL, SERIF } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/* `FROSTED`, in the page's `--m-bar`: the surface, or the second surface once a pattern is on. */
const BAR_FILL = "bg-(--m-bar)/94 backdrop-blur-sm";

interface HeaderBarProps extends VariantProps {
  /** The variant drawing it: its mark, links and Reply button. */
  look: keyof typeof LOOKS;
}

/** The Reply button's text, the same in every variant. */
const REPLY_TEXT =
  "text-[11.5px] leading-[1.5] font-semibold tracking-[0.1em] uppercase";

/** The Reply button's fill. */
const ACCENT_FILL =
  "border-[var(--m-accent)] bg-[var(--m-accent)] text-[color:var(--m-accent-ink)]";
const SECONDARY_FILL =
  "border-[var(--m-secondary)] bg-[var(--m-secondary)] text-[color:var(--m-secondary-ink)]";

/*
 * The mark, in every variant: the heading face a step bolder at 24px, set tight.
 * Its optical size is pinned at 22, past Fraunces' 21.66 limit, so its
 * alternate letters (&, h, m, n, s) show; a face without
 * an optical size ignores it.
 */
const MARK = `${SERIF} text-[24px] leading-none tracking-[-0.04em] [font-variation-settings:'opsz'_22]`;

/** The mark's middle part: 20px in every variant; its colour is the variant's. */
const MARK_MIDDLE = "text-[20px]";

/*
 * The Reply button, the eyebrow's look at 11px (a button, not an eyebrow):
 * in the accent, the secondary under the pointer, or the other way round.
 */
const REPLY_ACCENT = `${REPLY_TEXT} ${ACCENT_FILL} hover:border-[var(--m-secondary)] hover:bg-[var(--m-secondary)] hover:text-[color:var(--m-secondary-ink)]`;
const REPLY_SECONDARY = `${REPLY_TEXT} ${SECONDARY_FILL} hover:border-[var(--m-accent)] hover:bg-[var(--m-accent)] hover:text-[color:var(--m-accent-ink)]`;

/** Balanced's look, which the others share but for the mark's colours and the Reply button. */
const ROUNDED = {
  mark: "text-[color:var(--m-ink)]",
  middle: AMPERSAND_INK,
  link: MUTED_LINK,
  links: "gap-7",
  reply: REPLY_SECONDARY,
};

/** Colourful accent's: the mark in the accent, its middle in the secondary, Reply in the accent. */
const SQUARE = {
  ...ROUNDED,
  mark: "text-[color:var(--m-accent)]",
  reply: REPLY_ACCENT,
};

/** Each variant's mark colour and its middle's, section links (look, gap) and Reply button. */
const LOOKS = {
  square: SQUARE,
  // Colourful accent with Reply in the secondary.
  colorful: { ...SQUARE, reply: REPLY_SECONDARY },
  rounded: ROUNDED,
  // Balanced with the mark's middle and Reply in the accent.
  roundedAccent: {
    ...ROUNDED,
    middle: "text-[color:var(--m-accent)]",
    reply: REPLY_ACCENT,
  },
  // The middle in the mark's own colour: one ink across the whole mark.
  plain: { ...ROUNDED, middle: "" },
  // Simple with Reply in the accent.
  plainAccent: { ...ROUNDED, middle: "", reply: REPLY_ACCENT },
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
  const mark = markParts(
    values,
    "mark",
    `${MARK_MIDDLE} ${LOOKS[look].middle}`,
  );

  return (
    <header
      className={`${BAR_FILL} group/edit sticky top-0 z-20 border-b-1 border-[var(--m-line)] text-[color:var(--m-ink)]`}
    >
      {/* The bar spans the page; its content stays in the column. */}
      <div className="relative mx-auto flex h-14 max-w-(--invite-column) items-center gap-3 px-3 @5xl:h-16 @5xl:gap-8 @5xl:px-10">
        {links.length > 0 ? (
          // The icon sits on the bar's edge; the button keeps its 44px for a thumb.
          <button
            type="button"
            aria-label={t("openSections")}
            id={SECTIONS_TRIGGER_ID}
            aria-expanded={nav?.menuOpen ?? false}
            onClick={nav?.onOpenMenu}
            className="-mx-3 flex size-11 shrink-0 items-center justify-center @5xl:hidden"
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
          className={`${LOOKS[look].reply} ${PILL} inline-flex h-8 shrink-0 items-center border-1 px-4 transition-colors`}
        >
          {t("rsvp")}
        </a>
      </div>
      {/* At the page's edge, as on the sections; sticky places them like relative. */}
      {nav?.edit}
    </header>
  );
}
