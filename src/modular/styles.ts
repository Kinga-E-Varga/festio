import { otherGround } from "./ground";
import type { SectionGround } from "@/types/modular";

/*
 * The modular library's one scale. Variants build from these and from plain
 * Tailwind steps — no one-off pixel values — so a change here reaches every
 * section. Every colour is a `--m-*` name; the page root sets the body face,
 * so only headings name a font. Type constants carry no colour unless the
 * name says so: the variant picks it, usually `MUTED`.
 */

/* ── Faces and headings ─────────────────────────────────────────────── */

/** The heading face at regular weight, whatever the pair. */
export const SERIF = "font-[family-name:var(--font-secondary)] font-normal";

/**
 * Headings: the heading face, balanced, and free to break a word too long
 * for a phone (a Hungarian compound) rather than push the page sideways.
 * Size and colour are the variant's.
 */
export const HEADING = `${SERIF} text-balance [overflow-wrap:anywhere]`;

const H2_FACE = `${HEADING} leading-[1.15] tracking-[-0.03em]`;

/** A section's main heading. */
export const H2 = `${H2_FACE} text-[34px] @3xl:text-[44px] @5xl:text-[48px]`;

/** A section's main heading a step smaller, for a card with little room: Playlist's Card. */
export const H2_SMALL = `${H2_FACE} text-[28px] @3xl:text-[34px] @5xl:text-[38px]`;

const CARD_HEADING = `${HEADING} leading-[1.3] text-[color:var(--m-ink)]`;

/** A card's heading. */
export const H3 = `${CARD_HEADING} text-[24px]`;

/** An item's heading in a card: an event, a way, a stay, a dish, a note. */
export const H3_ITEM = `${CARD_HEADING} text-[22px]`;

/** A small serif line: a question, an event, a stay, a closing line. Colour is the variant's. */
export const H4 = `${HEADING} text-[17px] leading-[1.4] @3xl:text-[18px]`;

/** A serif line in italic: the title's caption, the reply note. Colour is the variant's. */
export const ITALIC_LINE = `${HEADING} text-[20px] leading-[1.4] italic`;

/** A short serif line on the cover photo: the kicker's circle, the date's box. Colour is the variant's. */
export const COVER_LINE = `${HEADING} text-[14px] leading-[1.25] @3xl:text-[18px]`;

/** An item's title in the newer variants — an event, a way, a stay, a dish: `H4` in ink. */
export const ITEM_TITLE = `${H4} text-[color:var(--m-ink)]`;

/** A list's large time or number: the body face, bold, tabular digits. */
export const TIME_TEXT =
  "text-[22px] leading-none font-semibold tracking-[0.03em] tabular-nums";

/*
 * A list's large time or number, in its own column (Schedule's Icon & list,
 * Transportation's lists): the body face, bold, as wide as the widest time
 * can be — five tabular digits ("12:30") plus the tracking — so every row's
 * title starts in the same place, in any font.
 */
export const TIME_COLUMN = `w-[5.3ch] ${TIME_TEXT}`;

/** Large serif in the accent, set tight: the names, the day, the countdown, the mark. Size is the variant's. */
export const DISPLAY = `${HEADING} leading-none tracking-[-0.06em] text-[color:var(--m-accent)]`;

/**
 * Large serif set the way the optical size wants it: regular weight, a touch
 * tight. The Plain date. Size and colour are the variant's.
 */
export const DISPLAY_PLAIN = `${SERIF} text-balance [overflow-wrap:anywhere] leading-none tracking-[-0.03em]`;

/** The title's names' size, the same in every variant. */
export const NAMES_SIZE =
  "text-[48px] @md:text-[56px] @3xl:text-[68px] @5xl:text-[80px]";

/**
 * Large text cut out of a pattern: an outline in the surface round each
 * letter, drawn behind its fill, so only its outer half shows (half of
 * `--m-text-cut`, set by the page: 0.1em with a pattern on, none without),
 * times `--m-text-cut-scale` where a use sets one (`TEXT_CUT_THICK`).
 * Part of `STICKER_TEXT`.
 */
export const TEXT_CUT =
  "[-webkit-text-stroke:calc(var(--m-text-cut,0)*var(--m-text-cut-scale,1))_var(--m-surface)] [paint-order:stroke_fill]";

/** `TEXT_CUT` a little thicker: the Text box's Sticker joined, its text smaller than the title's names. */
export const TEXT_CUT_THICK = "[--m-text-cut-scale:1.6]";

/**
 * The sticker look for large heading-face text: medium, cut out of a pattern
 * (`TEXT_CUT`). Forced medium, as the heading face sets regular. The title's
 * stickers' names, the Text box's Sticker joined.
 */
export const STICKER_TEXT = `${TEXT_CUT} font-medium!`;

/** The title's names, in the accent, a touch looser than `DISPLAY`: also Date's big day. */
export const NAMES = `${DISPLAY} ${NAMES_SIZE} tracking-[-0.03em]!`;

/** One large plain line: the band date, Heading & date's date, the date box's date, Days first's days, the calendar's side days, the bold reply's heading. Colour is the variant's. */
export const BAND_LINE = `${DISPLAY_PLAIN} text-[40px] @md:text-[48px] @3xl:text-[54px] @5xl:text-[60px]`;

/** The middle part's size beside the line's other parts. */
export const AMPERSAND_SIZE = "text-[0.8em]";
/** The middle part's colour, in every three-part line. */
export const AMPERSAND_INK = "text-[color:var(--m-secondary)]";
/** The middle part of a three-part line (the title's names, the footer's mark): a size smaller than the line. */
export const AMPERSAND = `${AMPERSAND_SIZE} ${AMPERSAND_INK}`;

/* ── Running text ───────────────────────────────────────────────────── */

/** Running text: under a section heading, a card's notes, answers, transport, the thank-you. */
export const BODY = "text-[14px] leading-[1.8]";

/** Smaller text: an event's note, a course, a footnote, account details. */
export const BODY_SM = "text-[13px] leading-[1.7]";

/** Small print: captions, side notes, a swatch note. */
export const CAPTION = "text-[12px] leading-[1.5]";

/** The small uppercase line above a heading, a date or a card. Colour is the variant's. */
export const EYEBROW =
  "text-[12.5px] leading-[1.5] font-semibold tracking-[0.14em] uppercase";

/** The eyebrow inside a section — a card's, a day's — 11px at every width, its lines balanced. Colour is the variant's. */
export const INNER_EYEBROW =
  "text-[11px] leading-[1.5] font-semibold tracking-[0.19em] text-balance uppercase";

/** A quieter uppercase label: a venue's kind, a course, units, a weekday, an account line. */
export const CAPS = "text-[10px] leading-[1.5] tracking-[0.14em] uppercase";

/** The page's muted ink, for most running text. */
export const MUTED = "text-[color:var(--m-ink-muted)]";

/* ── Links and buttons ──────────────────────────────────────────────── */

/** A small bold link's shape, with an arrow that nudges on hover (`ARROW_NUDGE`). Colour is the variant's. */
export const LINK =
  "group/link inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold";

/** `LINK` in the ink, fading a little on hover: Location's "Open in Maps", FAQ's link to the reply form. */
export const INK_LINK = `${LINK} text-[color:var(--m-ink)] transition-opacity hover:opacity-80`;

/** A quiet link in the muted ink, the secondary under the pointer: the header's sections, the way back up. */
export const MUTED_LINK = `inline-flex min-h-11 items-center gap-2 text-[12px] ${MUTED} transition-colors hover:text-[color:var(--m-secondary)]`;

/** The arrow inside a `group/link`. */
export const ARROW_NUDGE =
  "size-3.5 shrink-0 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5";

/** A small outlined button's shape and type, without its colour. */
const OUTLINE_SHAPE =
  "inline-flex min-h-8 shrink-0 items-center justify-center border-1 px-4 text-[12px] font-semibold tracking-[0.04em] transition-colors";

/** A small outlined button in the accent. Never shrinks, so its label never wraps. */
export const OUTLINE_BUTTON = `${OUTLINE_SHAPE} border-[var(--m-accent)] text-[color:var(--m-accent)] hover:bg-[var(--m-accent)] hover:text-[color:var(--m-accent-ink)]`;

/** The same button in the secondary: the account's Copy in a gift card's side column. */
export const OUTLINE_SECONDARY = `${OUTLINE_SHAPE} border-[var(--m-secondary)] text-[color:var(--m-secondary)] hover:bg-[var(--m-secondary)] hover:text-[color:var(--m-secondary-ink)]`;

/*
 * The roles text is written in — ink, muted ink, secondary and accent — as
 * the palette sets them. A surface sets them back, so a card inside the
 * accent band reads as it does on the page.
 */
const PAGE_ROLES =
  "text-[color:var(--m-ink)] [--m-ink:var(--m-page-ink)] [--m-ink-muted:var(--m-page-ink-muted)] [--m-secondary:var(--m-page-secondary)] [--m-accent:var(--m-page-accent)]";

/*
 * On the accent band every one of those roles is the band's ink, muted ink
 * its mix, so whatever a variant writes in them reads on the band with no
 * case of its own. The band's fill reads the palette's accent from its
 * `page-` copy, as `--m-accent` is the ink here. Alone, for text on an
 * accent fill a variant draws itself (the playlist's band).
 */
export const ON_ACCENT =
  "text-[color:var(--m-ink)] [--m-ink:var(--m-accent-ink)] [--m-ink-muted:var(--m-accent-ink-muted)] [--m-secondary:var(--m-accent-ink)] [--m-accent:var(--m-accent-ink)]";

/** A ground's fill alone: the page paints it across the whole width, behind a section's column. */
export const GROUND_FILL: Record<SectionGround, string> = {
  surface: "bg-[var(--m-surface)]",
  "surface-alt": "bg-[var(--m-surface-alt)]",
  accent: "bg-[var(--m-page-accent)]",
};

/** A card's background, by its ground, with the roles that read on it. */
export const GROUND: Record<SectionGround, string> = {
  surface: `${GROUND_FILL.surface} ${PAGE_ROLES}`,
  "surface-alt": `${GROUND_FILL["surface-alt"]} ${PAGE_ROLES}`,
  accent: `${GROUND_FILL.accent} ${ON_ACCENT}`,
};

/**
 * A section's roles, by its ground, without the fill: the page paints that
 * across the whole width (`GROUND_FILL`), the pattern over a surface, so a
 * section's root leaves it showing.
 */
export const SECTION_GROUND: Record<SectionGround, string> = {
  surface: PAGE_ROLES,
  "surface-alt": PAGE_ROLES,
  accent: ON_ACCENT,
};

/* ── Section layout ─────────────────────────────────────────────────── */

/** A section's side padding: 24px on a phone, 64px from `@3xl`, 100px from `@5xl`. */
export const PAD_X = "px-6 @3xl:px-16 @5xl:px-25";

/** A section's top and bottom padding, apart so a section may drop one: 64px on a phone, 100px from `@3xl`. */
export const PAD_TOP = "pt-16 @3xl:pt-25";
export const PAD_BOTTOM = "pb-16 @3xl:pb-25";

/** A section's padding. */
export const PAD = `${PAD_X} ${PAD_TOP} ${PAD_BOTTOM}`;

/** A heading over its content. */
export const STACK = "flex flex-col gap-8 @3xl:gap-11";

/**
 * Round a heading over a timeline: 16px more under it (24px from `@3xl`)
 * than `STACK`'s gap, gone with the heading, so a timeline with none starts
 * where it did. Schedule's Timeline and Our story's Moments.
 */
export const TIMELINE_HEADING = "mb-4 empty:hidden @3xl:mb-6";

/** A timeline: 350px at most and centred on a phone, 960px from `@3xl`, its line down the middle. */
export const TIMELINE = "mx-auto w-full max-w-[350px] @3xl:max-w-240";

/** A timeline's stop: the line's column, then the stop; from `@3xl` the line in the middle, stops on either side. */
export const TIMELINE_STOP =
  "grid grid-cols-[2.375rem_minmax(0,1fr)] gap-x-4 @3xl:grid-cols-[minmax(0,1fr)_2.375rem_minmax(0,1fr)] @3xl:gap-x-6";

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

/** A box's corners, as round as the host's corners step (`corners.ts`). */
export const CORNER = "rounded-(--m-corner)";

/** A button's or small label's corners: fully round on the last step. */
export const PILL = "rounded-(--m-corner-pill)";

/** A form field's or its dropdown list's corners: the box's, but never rounder than soft's. */
export const FIELD_CORNER = "rounded-(--m-corner-field)";

/** A card's padding. */
const CARD_PAD = "p-6 @3xl:px-8 @3xl:py-7";

/** A hairline frame with the corners step: each of a double frame's two (Menu's Framed card, Text box's Framed). */
export const HAIRLINE_FRAME = `${CORNER} border-1 border-[var(--m-line)]`;

/** A card: a hairline edge, the corners and its padding. Its ground is the variant's. */
export const CARD = `${HAIRLINE_FRAME} ${CARD_PAD}`;

/** A card on the accent, its padding the variant's: no hairline, its fill is its edge, as Location's accent cards. */
export const ACCENT_FILL_CARD = `${CORNER} ${GROUND.accent}`;

/** `ACCENT_FILL_CARD` with a card's padding. */
export const ACCENT_CARD = `${ACCENT_FILL_CARD} ${CARD_PAD}`;

/** A card on the other surface from its section's (`otherGround`). */
export function otherCard(ground: SectionGround): string {
  return `${CARD} ${GROUND[otherGround(ground)]}`;
}

/** Cards one under another, 12px apart (16px from `@3xl`). */
export const CARD_STACK = "flex flex-col gap-3 @3xl:gap-4";

/** A list 350px at most and centred on a phone; its column's width from `@3xl`. */
export const NARROW_LIST =
  "mx-auto w-full max-w-[350px] @3xl:mx-0 @3xl:max-w-none";

/** A row ending in a disc's column (38px, `CARD_DISC`), 24px from its content. Its alignment is the variant's. */
export const DISC_ROW = "grid grid-cols-[minmax(0,1fr)_2.375rem] gap-x-6";

/** A row led by a number or icon column (`TIME_COLUMN`), 12px from its content, the two centred on each other. */
export const LEAD_ROW =
  "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3";

/** Frosted glass: the page's surface, a touch see-through, blurring what passes under it. */
export const FROSTED = "bg-[var(--m-surface)]/94 backdrop-blur-sm";

/** A round icon holder; its size is the variant's, its colours come from `TONES`. */
export const ICON_DISC = "grid shrink-0 place-items-center rounded-full";

/** A card's or list's icon holder: 38px, the same in every variant (its glyph is 22px). */
export const CARD_DISC = `${ICON_DISC} size-9.5`;

/** Icon on its soft ground, in either accent. */
export const TONES = {
  accent: "bg-[var(--m-accent-soft)] text-[color:var(--m-accent)]",
  secondary: "bg-[var(--m-secondary-soft)] text-[color:var(--m-secondary)]",
} as const;

/** Text in either accent, matching its `TONES` icon. */
export const TONE_TEXT = {
  accent: "text-[color:var(--m-accent)]",
  secondary: "text-[color:var(--m-secondary)]",
} as const;

/** The tone a list's items take in turn: the first in the accent, the next in the secondary, and so on. */
export function turnTone(index: number): "accent" | "secondary" {
  return index % 2 === 0 ? "accent" : "secondary";
}

/*
 * Columns for one to six cards: up to four all in a row once there is room,
 * two by two for four on a mid-width page. Five and six go in rows of
 * three (two on a mid-width page) — five is the only count left with an
 * empty cell.
 */
const COLUMNS = [
  "",
  "",
  "@3xl:grid-cols-2",
  "@3xl:grid-cols-3",
  "@3xl:grid-cols-2 @5xl:grid-cols-4",
  "@3xl:grid-cols-2 @5xl:grid-cols-3",
  "@3xl:grid-cols-2 @5xl:grid-cols-3",
];

export function columnsFor(count: number): string {
  return COLUMNS[Math.min(count, COLUMNS.length - 1)];
}

/** A grid of cards: as `columnsFor`, but two side by side are 520px each at most, centred. */
export function cardColumns(count: number): string {
  return count === 2
    ? "@3xl:grid-cols-[repeat(2,minmax(0,520px))] @3xl:justify-center"
    : columnsFor(count);
}

/** A card's content in a `columnsFor` grid: centred while the cards stack, from the left once they sit side by side. */
export function centredWhenStacked(count: number): string {
  return count > 1
    ? "items-center text-center @3xl:items-start @3xl:text-left"
    : "items-center text-center";
}

/**
 * A grid with hairlines between its cells (Menu's courses, Location's
 * venues without photos): a line above and below the whole, and each cell
 * its own top line and a shorter left one that stops short of the lines
 * above and below, pulled 1px up and left, so the lines follow whatever
 * way the cells wrap; the grid clips the ones along its outer edge. Real
 * lines, not 1px gaps: a gap at a fractional position can round away to
 * nothing. Columns are the variant's (`columnsFor`).
 */
export const LINED_GRID =
  "grid overflow-hidden border-y-1 border-[var(--m-line)]";
export const LINED_CELL =
  "relative -mt-px -ml-px border-t-1 border-[var(--m-line)] before:absolute before:inset-y-6 before:left-0 before:w-px before:bg-[var(--m-line)]";
