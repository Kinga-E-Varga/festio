/**
 * The two warning colourings. Light, for a warning sitting on a light card
 * (the to-dos); dark, for one on the page or a darker ground (the warning
 * banners, Not coming).
 */
/** The Festio lockup as a mask, so the caller picks its colour (`bg-*`) and height. */
export const LOCKUP =
  "block aspect-[148/32] mask-[url(/festio-lockup-alt.svg)] mask-contain mask-center mask-no-repeat";

export const WARNING_LIGHT =
  "border-warning-500/50 bg-warning-50 text-warning-700";
export const WARNING_DARK =
  "border-warning-700/50 bg-warning-100 text-warning-700";
/** The positive colouring (Coming): the dark warning's shades in green, its border, fill and ink a step darker. */
export const SUCCESS_DARK =
  "border-primary-800/50 bg-primary-150 text-primary-800";
/** The info boxes' colouring: the dark warning's shades, in blue. */
export const INFO_DARK = "border-info-700/50 bg-info-100 text-info-700";
/** The danger colouring (Unknown and Duplicate tags, the danger zone): the dark warning's shades in brick, its fill and ink a step darker. */
export const DANGER_DARK = "border-danger-800/50 bg-danger-150 text-danger-800";

/** Every text link and link-like button in the dashboard: colour, weight, hover. Size is the caller's. */
export const TEXT_LINK =
  "font-semibold text-accent-700 underline-offset-[3px] transition-colors hover:text-accent-900 hover:underline";

/** A link at the boxes' line size: the dashboard's usual link. */
export const LINK_TEXT = `meta-face ${TEXT_LINK}`;

/**
 * A nav item's margins, inset from the nav's edges as far as the strip's
 * buttons are (10px). Here, not in `NavLink`, so the server-drawn nav can read it.
 */
export const NAV_MARGIN = "mx-2.5";

/** Every icon in the nav: one size, one line. */
export const SIDE_ICON = { className: "size-[18px]", strokeWidth: 1.75 };

/** The right-hand strip's icons and the side panel's X: a size up, the same line. */
export const STRIP_ICON = { className: "size-[22px]", strokeWidth: 1.75 };

/** The phone's top bar: its buttons a step over the strip's, 40px around 24px icons. */
export const TOP_BAR_ICON = { className: "size-6", strokeWidth: 1.75 };
export const TOP_BAR_CIRCLE = "max-nav:size-10";

/**
 * An icon button on the right-hand strip, the phone's top bar and the
 * side panels: round and 36px like the nav's links, in their tint, and gold
 * like the current link while the panel or menu it opens is open.
 */
export const BAR_ICON =
  "relative grid size-btn place-items-center rounded-full text-neutral-900 transition-colors hover:bg-secondary-400/30 hover:text-neutral-950 aria-expanded:bg-secondary-400 aria-expanded:text-neutral-950";

/** The nav's way out at its foot, set apart by a rule: Quit dashboard, and the editors' Quit editor. */
export const QUIT_RULE = "border-t border-neutral-300 pt-3";
export const QUIT_ITEM =
  "flex h-btn items-center gap-3 rounded-ui px-3 nav-text transition-colors hover:bg-secondary-400/30 hover:text-neutral-950";

/** The page column's side padding: main's, and the full-bleed bars' inside them, so their content lines up. */
export const PAGE_GUTTER = "px-[18px] nav:px-8 min-[1200px]:px-12";

/**
 * Full-bleed: as wide as the dashboard's `main` (`--main-width`), its left
 * margin taking it back to main's edge from the page's centred column.
 */
export const BLEED = "ml-[calc(50%-var(--main-width)/2)] w-(--main-width)";

/** A page box's padding, all round: for a box drawn some other way, too. */
export const BOX_PAD = "p-[18px] @min-[600px]:p-6";

/** A card's frame, unpadded: for a card that pads its own parts. */
export const CARD_FRAME = "rounded-ui border border-neutral-300 bg-neutral-50";

/** A page's box: the Overview's and Home's cards. */
export const PAGE_BOX = `${CARD_FRAME} ${BOX_PAD}`;

/**
 * A page's two columns, Home's and the Overview's: a narrow one of small
 * boxes, a third of the width, and the main one beside it. One column under
 * 860px; each starts at 0 so a long name is cut short, not holding it wide.
 */
export const TWO_COLUMNS =
  "grid grid-cols-[minmax(0,1fr)] gap-4 @min-[860px]:grid-cols-[minmax(260px,1fr)_minmax(0,2fr)]";

/** Rows in a box's list, a `neutral-200` rule between each. */
export const BOX_ROWS = "divide-y divide-neutral-200";

/** One row ruled off from the one before, for a row that sets its own spacing: the same rule as `BOX_ROWS`. */
export const BOX_ROW = "border-t border-neutral-200 first:border-t-0";

/** A floating menu's surface: the picker's list and the bars' and toolbar's menus. */
export const MENU_SURFACE =
  "rounded-ui border border-neutral-400 bg-neutral-50 shadow-card";
/** The bars' and toolbar's menus, floating by the button that opens them. */
export const MENU_BOX = `absolute z-10 overflow-hidden py-1 ${MENU_SURFACE}`;
/** A row in the bars' menus: the language menu's and the phone's More menu. */
export const MENU_ROW =
  "flex w-full items-center gap-3 px-3 py-2 text-left field-text text-neutral-800 transition-colors hover:bg-secondary-400/30";

/**
 * A row that opens something: a hover tint run out to the box's edges, so the
 * row's text stays in line with the box's title.
 */
export const ROW_LINK =
  "-mx-3 rounded-ui px-3 transition-colors hover:bg-secondary-400/20";

/**
 * The width a dashboard page's content takes, centred under its full-width
 * header: the four sizes in `globals.css`, the widest with no cap at all.
 */
export const CONTENT_WIDTH = {
  narrow: "mx-auto w-full max-w-narrow",
  form: "mx-auto w-full max-w-form",
  page: "mx-auto w-full max-w-page",
  full: "w-full",
} as const;
