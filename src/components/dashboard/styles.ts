/** The Festio lockup as a mask, so the caller picks its colour (`bg-*`) and height. */
export const LOCKUP =
  "block aspect-[148/32] mask-[url(/festio-lockup-alt.svg)] mask-contain mask-center mask-no-repeat";

/**
 * The borderless tones: a fill a step deeper than the bordered ones' instead of
 * a border. The border stays, transparent, so a tag keeps its size. The event
 * status tags (Live, Hidden, Past), a reply's Coming and Not coming (in
 * Live's and Hidden's) and the attention tags, and the latest replies'
 * initials in the green or the red; the warning one is the to-dos' too.
 */
export const SUCCESS_SOFT =
  "border-transparent bg-primary-200 text-primary-800";
export const WARNING_SOFT =
  "border-transparent bg-warning-150 text-warning-700";
/** The info one, its fill and words only (callers with an edge pick its colour): the event editor's notes, the print panel's instructions. */
export const INFO_SOFT = "bg-info-150 text-info-700";
export const NEUTRAL_SOFT =
  "border-transparent bg-neutral-300 text-neutral-800";
/** The danger one: Unknown and Duplicate. */
export const DANGER_SOFT = "border-transparent bg-danger-200 text-danger-800";
/**
 * The replies bars' look, against expected guests (`.replies-bar`): 10px
 * tall, each part apart from the next by a sliver of the card, the expected
 * guests still to reply as a part of its own (`BAR_TRACK`). The Overview's
 * and Home's bar, and the editor's meter.
 */
export const REPLIES_BAR = "replies-bar h-2.5 gap-0.5 bg-neutral-50";
export const BAR_TRACK = "flex-1 bg-neutral-200";
/** A reply's status as a fill: the guest list's dots, the replies bar and its legend; Coming's is the event picker's live dot and the editor's replies meter too. */
export const STATUS_FILL = {
  going: "bg-primary-700",
  not_going: "bg-warning-400",
} as const;
/** A prompt's box, without colours: `ALERT` and `DANGER_ALERT`. */
const ALERT_FRAME = "rounded-ui px-4 py-3 meta-face";
/** A prompt inside an editor or a row (unsaved changes, keep together, the list box's questions): the to-dos' warning colours, with no edge, as the warning banners. */
export const ALERT = `${ALERT_FRAME} ${WARNING_SOFT}`;
/** The danger colouring (a delete's confirm, `DANGER_ALERT`): a pale brick fill, its border and ink in a dark brick. */
export const DANGER_DARK = "border-danger-800/50 bg-danger-150 text-danger-800";
/** The `ALERT` prompt in danger's colours, its edge unused: a delete's confirm. */
export const DANGER_ALERT = `${ALERT_FRAME} ${DANGER_DARK}`;

/**
 * A tag's words: its own whole-pixel line, so every tag is 18px tall wherever
 * it sits and its edges land on whole pixels. The letter spacing also trails
 * the last letter; an indent as wide puts the same before the first, so the
 * words sit centred.
 */
export const TAG_TEXT =
  "text-[10px] leading-[14px] font-semibold tracking-[0.12em] indent-[0.12em] whitespace-nowrap uppercase";
/** Their padding inside the tag's 1px border. */
export const TAG_PAD = "px-1.5 py-px";
/** A small flag: Unknown, Duplicate beside a name or in the latest replies, a reply's Coming / Not coming, a waiting name's invite. */
export const TAG = `rounded-ui border ${TAG_PAD} ${TAG_TEXT}`;
/** Unknown and Duplicate: the tags that mark a reply needing attention. */
export const ATTENTION_TAG = `${TAG} ${DANGER_SOFT}`;

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

/** The right-hand strip's icons, the phone's top bar's and the side panel's X: a size up, the same line. */
export const STRIP_ICON = { className: "size-[22px]", strokeWidth: 1.75 };

/**
 * An icon button on the right-hand strip, the phone's top bar and the
 * side panels: round and 36px like the nav's links, in their tint, and gold
 * like the current link while the panel or menu it opens is open.
 */
export const BAR_ICON =
  "relative grid size-btn place-items-center rounded-full text-neutral-900 transition-colors hover:bg-secondary-400/30 hover:text-neutral-950 aria-expanded:bg-secondary-400 aria-expanded:text-neutral-950";

/** The bars' feet, set apart by a rule: the nav's language (Quit dashboard in the phone's drawer) and the strip's Quit dashboard. */
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

/**
 * The page boxes' padding as `--box-pad`, for a box that pads its parts with it (the guest list's); `--box-head-y`, a header bar's padding over and under, switches with it.
 * `--box-gap`, the padding less 2px: the space under a box's title (`BoxHead`) and between its groups, which looks as much as the padding over the title, as text lines keep room for descenders under their letters.
 */
export const BOX_PAD_SIZE =
  "[--box-pad:18px] [--box-head-y:14px] [--box-gap:calc(var(--box-pad)-2px)] @min-[600px]:[--box-pad:24px] @min-[600px]:[--box-head-y:18px]";

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

/** The Overview's invitation picture's edge, shared by its frame and the Edit tag on its corner: the picture is a page box of its own, edged like the others. */
export const PREVIEW_EDGE = "border-neutral-300";

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
/** The small action's shape, for the prompts on an alert, the row editor and an unknown reply's fixes. */
export const SMALL_BTN_SHAPE =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-ui border px-3 py-1.5 button-text whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50";

/**
 * The warning prompts' buttons' colours, at either size: filled in the
 * warning's words colour with its fill for the words, for the choice the
 * prompt leans to…
 */
const WARN_SOLID =
  "border-warning-700 bg-warning-700 text-warning-150 hover:border-warning-800 hover:bg-warning-800";
/** …or outlined in it, its edge and words darker when hovered. */
const WARN_OUTLINE =
  "border-warning-700 text-warning-700 hover:border-warning-900 hover:text-warning-900";
/** The pair at full size, for the save confirm… */
export const BTN_WARN = `${BUTTON} ${WARN_SOLID}`;
export const BTN_WARN_OUTLINE = `${BUTTON} ${WARN_OUTLINE}`;
/** …and small, on a warning prompt (`ALERT`). */
export const SMALL_BTN_WARN_SOLID = `${SMALL_BTN_SHAPE} ${WARN_SOLID}`;
export const SMALL_BTN_WARN = `${SMALL_BTN_SHAPE} ${WARN_OUTLINE}`;

/** The quiet icon-only actions at the end of a row; a `data-tip` gives one its quick label. */
const ICON_BASE =
  "icon-tip grid size-8 cursor-pointer place-items-center rounded-ui text-neutral-600 transition-colors";
export const ICON_BTN = `${ICON_BASE} hover:bg-neutral-200 hover:text-neutral-950`;
/** Delete: the same button, turning danger on hover. */
export const ICON_BTN_DANGER = `${ICON_BASE} hover:bg-danger-200 hover:text-danger-600`;

/** The small icon-only control that sits inside a field. */
export const MINI =
  "grid place-items-center text-neutral-700 transition-colors hover:text-accent-700";

/** A panel that hangs off the control above it, sharing its edge. */
export const SUBBOX = "-mt-px rounded-b-ui border border-secondary-300 p-4";

/** A banner's title, in the banner's own small type: also the info and warning boxes' titles. */
export const BANNER_TITLE = "mb-[3px] block item-face leading-[1.5]";
