import type { Ground, ModularPattern } from "@/types/modular";

/*
 * The modular library's one scale. Variants build from these and from plain
 * Tailwind steps — no one-off pixel values — so a change here reaches every
 * section. Every colour is a `--m-*` name; the page root sets the body face,
 * so only headings name a font. Type constants carry no colour unless the
 * name says so: the variant picks it, usually `MUTED`.
 */

/* ── Faces and headings ─────────────────────────────────────────────── */

/** The pair's heading face. */
export const SERIF = "font-[family-name:var(--font-secondary)] font-normal";

/**
 * Headings: the heading face, balanced, and free to break a word too long
 * for a phone (a Hungarian compound) rather than push the page sideways.
 * Size and colour are the variant's.
 */
export const HEADING = `${SERIF} text-balance [overflow-wrap:anywhere]`;

/** A section's main heading. */
export const H2 = `${HEADING} text-[34px] leading-[1.15] tracking-[-0.03em] @3xl:text-[44px] @5xl:text-[48px]`;

/** A card's heading. */
export const H3 = `${HEADING} text-[22px] leading-[1.3] text-[color:var(--m-ink)]`;

/** A small serif line: a question, an event, a stay, a closing line. Colour is the variant's. */
export const H4 = `${HEADING} text-[17px] leading-[1.4] @3xl:text-[18px]`;

/** Large serif in the accent, set tight: the names, the day, the countdown, the mark. Size is the variant's. */
export const DISPLAY = `${HEADING} leading-none tracking-[-0.06em] text-[color:var(--m-accent)]`;

/** The `&` in a mark or the hosts' names. */
export const AMPERSAND = "text-[0.8em] italic text-[color:var(--m-secondary)]";

/* ── Running text ───────────────────────────────────────────────────── */

/** Text under a section heading. */
export const LEAD = "text-[15px] leading-[1.85]";

/** A card's text: notes, answers, transport, the thank-you. */
export const BODY = "text-[14px] leading-[1.8]";

/** Smaller text: an event's note, a course, a footnote, account details. */
export const BODY_SM = "text-[13px] leading-[1.7]";

/** Small print: captions, side notes, a swatch note. */
export const CAPTION = "text-[12px] leading-[1.5]";

/** The small uppercase line above a heading, a date or a card. Colour is the variant's. */
export const EYEBROW =
  "text-[11px] leading-[1.5] font-semibold tracking-[0.19em] uppercase";

/** A quieter uppercase label: a venue's kind, a course, units, a weekday, an account line. */
export const CAPS = "text-[11px] leading-[1.5] tracking-[0.14em] uppercase";

/** The page's muted ink, for most running text. */
export const MUTED = "text-[color:var(--m-ink-muted)]";

/* ── Links and buttons ──────────────────────────────────────────────── */

/** A small bold link's shape, with an arrow that nudges on hover (`ARROW_NUDGE`). Colour is the variant's. */
export const LINK =
  "group/link inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold";

/**
 * A link that reads as text, underlined in the colour around it: Open in
 * Maps, the FAQ's way to the reply form.
 */
export const UNDERLINE_LINK = `${LINK} underline decoration-current underline-offset-6 transition-opacity hover:opacity-80`;

/** A quiet link in the muted ink, the secondary under the pointer: the top bar's sections, the way back up. */
export const MUTED_LINK = `inline-flex min-h-11 items-center gap-2 text-[13px] ${MUTED} transition-colors hover:text-[color:var(--m-secondary)]`;

/** The arrow inside a `group/link`. */
export const ARROW_NUDGE =
  "size-3.5 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5";

/** A small outlined button (Copy). Never shrinks, so its label never wraps. */
export const OUTLINE_BUTTON =
  "inline-flex min-h-9 shrink-0 items-center justify-center border-1 border-[var(--m-accent)] px-4 text-[12px] font-semibold tracking-[0.04em] text-[color:var(--m-accent)] transition-colors hover:bg-[var(--m-accent)] hover:text-[color:var(--m-accent-ink)]";

/** A section's or card's background, by its ground. */
export const GROUND: Record<Ground, string> = {
  surface: "bg-[var(--m-surface)]",
  "surface-alt": "bg-[var(--m-surface-alt)]",
};

/* ── Section layout ─────────────────────────────────────────────────── */

/** A section's side padding: tighter on a phone, wide on a wide page. */
export const PAD_X = "px-6 @3xl:px-14 @5xl:px-30";

/** A section's top and bottom padding, apart so a section may drop one. */
export const PAD_TOP = "pt-16 @3xl:pt-20 @5xl:pt-27";
export const PAD_BOTTOM = "pb-16 @3xl:pb-20 @5xl:pb-27";

/** A section's padding. */
export const PAD = `${PAD_X} ${PAD_TOP} ${PAD_BOTTOM}`;

/** A heading over its content. */
export const STACK = "flex flex-col gap-8 @3xl:gap-11";

/** Two columns side by side, the narrow one first (the venue card and photo). */
export const SPLIT_COLUMNS = "@3xl:grid-cols-[2fr_3fr]";

const SPLIT_GAP = "gap-8 @3xl:gap-[8%] @5xl:gap-[10%]";

/**
 * A heading beside its content, one column on a phone. Room is shared in
 * this order: the content's 350px, the heading up to 410px, the content up
 * to 620px, then the rest to the heading. The content's cap is
 * `100% − gap − 410px`, so it only grows once the heading has its 410px —
 * the 92% and 90% are 100% less `SPLIT_GAP`'s 8% and 10%. Give the heading
 * its own cell even when it is empty, so the content keeps its column.
 */
export const SPLIT = `grid ${SPLIT_GAP} @3xl:grid-cols-[minmax(0,1fr)_minmax(350px,min(620px,calc(92%_-_410px)))] @5xl:grid-cols-[minmax(0,1fr)_minmax(350px,min(620px,calc(90%_-_410px)))]`;

/** Cards stacked down the middle, never wider than a comfortable read across. */
export const COLUMN = "mx-auto w-full max-w-240";

/** A comfortable line length for text standing on its own. */
export const MEASURE = "max-w-xl";

/* ── Cards and surfaces ─────────────────────────────────────────────── */

/** A card: a hairline edge and its padding. Its ground is the variant's. */
export const CARD = "border-1 border-[var(--m-line)] p-6 @3xl:px-8 @3xl:py-7";

/** Frosted glass: the page's surface, a touch see-through, blurring what passes under it. */
export const FROSTED = "bg-[var(--m-surface)]/94 backdrop-blur-sm";

/** A round icon holder; its size is the variant's, its colours come from `TONES`. */
export const ICON_DISC = "grid shrink-0 place-items-center rounded-full";

/** Icon on its soft ground, in either accent. */
export const TONES = {
  accent: "bg-[var(--m-accent-soft)] text-[color:var(--m-accent)]",
  secondary: "bg-[var(--m-secondary-soft)] text-[color:var(--m-secondary)]",
} as const;

/*
 * Columns for one to four cards: all in a row once there is room, two by two
 * for four on a mid-width page. Never an empty cell.
 */
const COLUMNS = [
  "",
  "",
  "@3xl:grid-cols-2",
  "@3xl:grid-cols-3",
  "@3xl:grid-cols-2 @5xl:grid-cols-4",
];

export function columnsFor(count: number): string {
  return COLUMNS[Math.min(count, 4)] ?? "";
}

/**
 * The invitation's ground — around its column on a wide guest screen, and
 * the editor's viewing area: `--m-canvas`, with the template's pattern if it
 * has one.
 */
export function groundClasses(pattern: ModularPattern | null): string {
  return `bg-[var(--m-canvas)] ${pattern?.className ?? ""}`;
}
