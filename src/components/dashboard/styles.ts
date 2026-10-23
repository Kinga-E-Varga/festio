/** The Festio lockup as a mask, so the caller picks its colour (`bg-*`) and height. */
export const LOCKUP =
  "block aspect-[148/32] mask-[url(/festio-lockup-alt.svg)] mask-contain mask-center mask-no-repeat";

/**
 * The borderless tones: a fill a step deeper than the bordered ones' instead of
 * a border. The border stays, transparent, so a tag keeps its size. The event
 * status tags (Live, Hidden, Past); the warning one is the to-dos' too.
 */
export const SUCCESS_SOFT =
  "border-transparent bg-primary-200 text-primary-800";
export const WARNING_SOFT =
  "border-transparent bg-warning-150 text-warning-700";
export const NEUTRAL_SOFT =
  "border-transparent bg-neutral-300 text-neutral-800";
/** The bordered warning: the warning banners, Not coming. */
export const WARNING_DARK =
  "border-warning-700/50 bg-warning-100 text-warning-700";
/** The positive colouring (Coming): the dark warning's shades in green, its border, fill and ink a step darker. */
export const SUCCESS_DARK =
  "border-primary-800/50 bg-primary-150 text-primary-800";
/** The info boxes' colouring: the dark warning's shades, in blue. */
export const INFO_DARK = "border-info-700/50 bg-info-100 text-info-700";
/** The danger colouring (Unknown and Duplicate tags, the danger zone): the dark warning's shades in brick, its fill and ink a step darker. */
export const DANGER_DARK = "border-danger-800/50 bg-danger-150 text-danger-800";

/** A text link without its colour, for a link coloured by what it acts on. Size is the caller's. */
export const TEXT_LINK_SHAPE =
  "font-semibold underline-offset-[3px] transition-colors hover:underline";

/** Every text link and link-like button in the dashboard: colour, weight, hover. Size is the caller's. */
export const TEXT_LINK = `${TEXT_LINK_SHAPE} text-accent-700 hover:text-accent-900`;

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

/** The page boxes' padding as `--box-pad`, for a box that pads its parts with it (the guest list's); `--box-head-y`, a header bar's padding over and under, switches with it. */
export const BOX_PAD_SIZE =
  "[--box-pad:18px] [--box-head-y:14px] @min-[600px]:[--box-pad:24px] @min-[600px]:[--box-head-y:18px]";

/** A page box's padding, all round: for a box drawn some other way, too. Set as `--box-pad`, so its title (`BoxHead`) can leave the same space under it. */
export const BOX_PAD = `p-(--box-pad) ${BOX_PAD_SIZE}`;

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

/** Rows in a box's list, a `neutral-200` rule between each: lighter than the box's border, on its `neutral-50`. */
export const BOX_ROWS = "divide-y divide-neutral-200";

/** One row ruled off from the one before, for a row that sets its own spacing: the same rule as `BOX_ROWS`. */
export const BOX_ROW = "border-t border-neutral-200 first:border-t-0";

/** The Overview's invitation preview edge, shared by its frame and the Edit tag on its corner: a box inside a box. */
export const PREVIEW_EDGE = "border-neutral-200";

/** A floating menu's surface: the picker's list and the bars' and toolbar's menus. */
export const MENU_SURFACE =
  "rounded-ui border border-neutral-400 bg-neutral-50 shadow-menu";
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

/*
 * Form presentation shared across the dashboard and its editors: fields,
 * buttons, soft actions and banners. Kept in one place so a change to the
 * way inputs look lands on every field at once.
 */

/** One fixed height for every single-line field (dates and selects otherwise size themselves), its text centred without padding so a select's descenders are not cut; textareas keep growing. */
export const FIELD =
  "w-full rounded-ui border px-3 [&:not(textarea)]:h-input [&:not(textarea)]:py-0 py-[9px] field-text transition-colors focus:outline-2 focus:-outline-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-800";
export const INPUT = `${FIELD} side-scroll [--scroll-track:var(--color-neutral-50)] font-normal border-neutral-400 bg-neutral-50 outline-neutral-500 hover:border-neutral-600 focus:border-neutral-500 disabled:border-neutral-400 date-icon`;

export const ERROR = "hint-face font-medium text-danger-800";

/** The soft action's colours ("Stop using the list", "Different person", the list box's Save), at any size. Hovered, the fill darkens two steps. */
export const SOFT_BTN =
  "border-neutral-400 bg-neutral-200 text-neutral-700 hover:bg-neutral-400 hover:text-neutral-800";
/** The soft action's shape and type, without colours. */
export const SOFT_ACTION_SHAPE =
  "inline-flex min-h-btn cursor-pointer items-center justify-center rounded-ui border px-2.5 py-2 text-center button-text leading-[1.3] transition-colors disabled:cursor-not-allowed disabled:opacity-50";
/** The soft action as a button ("Close earlier", the Content tab's Change photo). Callers add its width. */
export const SOFT_ACTION = `${SOFT_ACTION_SHAPE} ${SOFT_BTN}`;
/** The soft action's outline pair: a pale fill, and on hover the same fill as the soft action's hover. */
export const SOFT_OUTLINE =
  "border-neutral-400 bg-neutral-50 text-neutral-700 hover:bg-neutral-400 hover:text-neutral-800";
/** A pick among soft outline buttons: the soft action's fill once picked (`aria-pressed`). */
export const SOFT_PICK = `${SOFT_OUTLINE} aria-pressed:bg-neutral-200 aria-pressed:hover:bg-neutral-400`;

/** The big buttons' shape, without colours: every variant below builds on it. */
export const BUTTON =
  "inline-flex h-btn items-center justify-center gap-2 rounded-ui border px-4 button-text transition-colors disabled:cursor-not-allowed disabled:opacity-50";

/** The main action: in the accent colour, like every dashboard link. */
export const BTN_PRIMARY = `${BUTTON} border-accent-800 bg-accent-800 text-neutral-50 hover:border-accent-900 hover:bg-accent-900`;
/** The outlined action, the main one's fill colour for its edge and words, on the inputs' fill to sit in a row with them. */
export const BTN_GHOST_LIGHT = `${BUTTON} border-accent-800 bg-neutral-50 text-accent-800 hover:border-accent-950 hover:bg-accent-150 hover:text-accent-950`;

/** The small icon-only control that sits inside a field. */
export const MINI =
  "grid place-items-center text-neutral-700 transition-colors hover:text-accent-700";

/** A panel that hangs off the control above it, sharing its edge. */
export const SUBBOX = "-mt-px rounded-b-ui border border-secondary-300 p-4";

/** Deadlines, explanations and plain notices, each in its own tone. */
export type BannerTone = "warn" | "info" | "notice";

/** A banner's title, in the banner's own small type: also the info and warning boxes' titles. */
export const BANNER_TITLE = "mb-[3px] block item-face leading-[1.5]";

/** A banner's colours, also worn by the print panel's instructions. */
export const BANNER_TONE: Record<BannerTone, string> = {
  warn: WARNING_DARK,
  info: INFO_DARK,
  notice: "border-secondary-500 bg-secondary-200 text-secondary-600",
};
