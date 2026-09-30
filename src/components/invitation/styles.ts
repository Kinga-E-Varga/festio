/**
 * Guest-facing chrome, styled entirely from the template's palette. Festio's
 * own colours and faces must never reach an invitation, so every value here
 * is a `var()` the template supplies.
 */

/* Everything but the surface and the edge, so each field can name its own
 * without an override — two plain `bg-*` utilities, or a width on one side
 * against a width on all four, are settled by Tailwind's emit order rather
 * than by the class string. */
const FIELD_SHAPE =
  "w-full py-[6px] text-[16px] transition-colors focus:border-[var(--c3)] focus:outline-none";

/** The reply's boxed fields' type: the invitation's own face, a touch under regular. */
const REPLY_TYPE = "font-[family-name:var(--font-primary)] font-[350]";

/* The invitation's face and ink too. Kept apart from the shape so the reply's
 * boxed fields can name their own without an override. */
const FIELD_CORE = `${FIELD_SHAPE} font-[family-name:var(--font-primary)] text-[color:var(--c3)] placeholder:text-[color:var(--c4)]`;

/** A one-line field: a rule under the text, nothing around it. */
export const INPUT = `${FIELD_CORE} border-b-1 border-[var(--c2)] bg-transparent`;

/**
 * A boxed field — the reply's names, dropdowns, Other box and note: a `--c4`
 * border on `--c4` at 5%, written in `--c3`, its placeholder `--c4` at 60%. Focus turns the border
 * `--c3`. The 24px line is stated, not left to the font, so the Coming
 * buttons — which name the same line — stand exactly as tall. In the
 * invitation's primary face; the reply's buttons stay in Work Sans.
 */
export const BOXED_INPUT = `${FIELD_SHAPE} ${REPLY_TYPE} leading-[24px] border-1 border-[var(--c4)] bg-[color-mix(in_oklab,var(--c4)_5%,transparent)] px-3 text-[color:var(--c3)] placeholder:text-[color:color-mix(in_oklab,var(--c4)_60%,transparent)]`;

/**
 * A field the host writes several lines into. Boxed rather than underlined,
 * because a rule under a block of text reads as a line through the middle of
 * the field as soon as the text wraps past it; the box holds the whole of
 * what is being written.
 *
 * `resize-none` is part of the style: the panels these sit in are a fixed
 * width, and a dragged corner would pull the field out of its column.
 */
export const TEXTAREA = `${FIELD_CORE} border-1 border-[var(--c2)] bg-transparent px-3 resize-none`;

/**
 * A `select` states the panel's surface outright where the other fields let it
 * show through. Transparent leaves the drop-down list to the browser, which
 * paints it in system colours — white on white, or an ink no template chose.
 *
 * The list itself inverts: the panel's ink becomes its surface, so the options
 * read as a layer over the form rather than more of it, and the row under the
 * pointer takes `--c2` between the two.
 *
 * The border colour is the select's own — the browsers that draw a line around
 * the popup take it from there, which is why this field's underline is `--c3`
 * where every other field's is `--c2`.
 *
 * All of it reaches only as far as the browser allows. The picker is a native
 * popup: desktop Chrome and Firefox honour `option` colours, Safari and the
 * mobile pickers keep their system ones, and `:checked` is commonly painted
 * with the OS accent whatever the rule says.
 */
export const SELECT = `${FIELD_CORE} border-b-1 border-[var(--c2)] bg-[var(--c1)] [&>option]:bg-[var(--c3)] [&>option]:text-[color:var(--c1)] [&>option:hover]:bg-[var(--c2)] [&>option:hover]:text-[color:var(--c1)] [&>option:checked]:bg-[var(--c2)] [&>option:checked]:text-[color:var(--c1)]`;

const LABEL_CORE = "text-[11px] font-semibold tracking-[0.16em] uppercase";

export const LABEL = `${LABEL_CORE} text-[color:var(--c2)]`;

/** The reply form's labels: `--c4`, where the host's panels use `--c2`. */
export const REPLY_LABEL = `${LABEL_CORE} text-[color:var(--c4)]`;

const HINT_CORE = "text-[12px] leading-[1.45] text-justify";

/** The line under a field — counters, limits, the privacy note. */
export const HINT = `${HINT_CORE} text-[color:var(--c2)]`;

/** The reply's characters-left counter, in `--c4` like its labels. */
export const COUNT_HINT = `${HINT_CORE} text-[color:var(--c4)]`;

/** The reply's privacy note under Send, in `--c3`. */
export const PRIVACY_HINT = `${HINT_CORE} text-[color:var(--c3)]`;

/*
 * `transition-all`, not `transition-colors`: several of these hover on
 * `opacity` rather than a colour, and `transition-colors` doesn't cover it —
 * those buttons snapped instead of easing. Adding `transition-opacity` on the
 * variant below wouldn't fix it either, since both land in the same utility
 * group and Tailwind, not the class string's order, decides which wins.
 */
/*
 * Everything but the box: the icon-only variants below set their own size and
 * must not inherit a padding they would then have to override. `px-0` after
 * `px-5` in a class string does not win — Tailwind emits `.px-0` first, so
 * `.px-5` is the later rule and takes it. Anything shaped like an override
 * here has to be an omission instead.
 */
const BUTTON_CORE =
  "inline-flex items-center justify-center gap-2 text-[12px] font-semibold tracking-[0.1em] uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40";

/* Its own outline. The host bar's segments share one, so they start at CORE. */
const BUTTON_BASE = `${BUTTON_CORE} rounded-sm border-1`;

const BUTTON = `${BUTTON_BASE} px-5 py-3`;

/** The reply's Send — solid `--c2`, easing to the palette's hover colour `--c5`. */
export const SOLID = `${BUTTON} border-[var(--c2)] bg-[var(--c2)] text-[var(--c1)] hover:bg-[var(--c5)] hover:border-[var(--c5)]`;

/**
 * The button that closes a side panel back to the invitation, below the
 * breakpoint. In `--c2`, with the palette's hover colour `--c5`.
 */
export const VIEW = `${BUTTON} border-[var(--c2)] bg-[var(--c2)] text-[color:var(--c1)] hover:bg-[var(--c5)] hover:border-[var(--c5)]`;

/** The going / not-going choice — c3 instead of the submit button's c2. */
export const TOGGLE_SOLID = `${BUTTON} border-[var(--c3)] bg-[var(--c3)] text-[color:var(--c1)]`;
export const TOGGLE_OUTLINE = `${BUTTON} border-[var(--c3)] text-[color:var(--c3)] hover:text-[color:var(--c1)] hover:bg-[var(--c3)] hover:opacity-60`;

/*
 * The reply's Coming / Not coming: `--c3` like the toggles above, but square,
 * only as wide as their words, and as tall as a boxed field — its padding,
 * its 24px line and its 1px border. The words are Work Sans at 12px, like Send,
 * uppercase: 550 when picked, 450 when not. `transition-all` because the
 * hover is an opacity.
 */
const ATTEND = `inline-flex cursor-pointer items-center justify-center border-1 border-[var(--c3)] px-5 py-[6px] font-sans text-[12px] leading-[24px] tracking-[0.1em] uppercase transition-all duration-200`;
export const ATTEND_SOLID = `${ATTEND} font-[550] bg-[var(--c3)] text-[color:var(--c1)]`;
export const ATTEND_OUTLINE = `${ATTEND} font-[450] text-[color:var(--c3)] hover:text-[color:var(--c1)] hover:bg-[var(--c3)] hover:opacity-60`;

/** The one skin every control in the host's bar wears, written once. */
const HOST_SKIN = "border-[var(--c3)] bg-[var(--c1)] text-[color:var(--c3)]";

/**
 * What a segment inside the bar carries: ink and hover, no box of its own.
 *
 * Hover fills with `--c3` at 80% rather than dimming the control: the
 * segments share the bar's one surface, so an opacity change on the segment
 * itself could only fade the glyph, which reads as the control going away
 * rather than answering. The fill's own alpha lets the bar's surface show
 * through instead, so the answer is a softer ink, not a fading label. The
 * ink turns over to `--c1` with it.
 *
 * `data-active` holds that same fill for a segment that toggles something
 * open. It is an attribute rather than a second class the component appends,
 * because a plain `bg-*` tacked on would be competing with the one here and
 * Tailwind's emit order, not the class string, would settle it. As a
 * `.segment[data-active]` the rule simply outranks it.
 *
 * Hovering a segment that is already active deepens it to `--c7`, since the
 * fill it would otherwise take is the one it is already wearing. `--c7` is
 * optional in the palette contract, so `--c5` — the palette's own hover
 * colour — stands in for the templates that leave it null; without the
 * fallback those would lose the fill entirely on hover.
 */
/**
 * The hairline between two segments. Drawn by the segment on the right as a
 * pseudo-element rather than as a left border, for two reasons: a border
 * would take part of the segment's own width and shift its label off centre,
 * and above the breakpoint the bar opens a `gap-3` between segments, where a
 * border would hug the right-hand control instead of standing between the
 * two. The pseudo-element is pulled back half that gap — 6px, plus half its
 * own width — so the line sits in the middle of the gap at every size; below
 * the breakpoint there is no gap and `left-0` is already the middle.
 *
 * `first:before:hidden` keeps it off the leading segment, where it would
 * land on the bar's own outline.
 */
const HOST_DIVIDER = `relative before:pointer-events-none before:absolute before:content-[''] before:inset-y-0 before:left-0 before:w-px before:bg-[color-mix(in_oklab,var(--c3)_30%,transparent)] first:before:hidden invite:before:-left-[6.5px]`;

const HOST_SEGMENT_CORE = `${BUTTON_CORE} ${HOST_DIVIDER} text-[color:var(--c3)] hover:bg-[color-mix(in_oklab,var(--c3)_15%,transparent)] hover:text-[color:var(--c3)]`;

const HOST_SEGMENT = `${HOST_SEGMENT_CORE} data-[active=true]:bg-[var(--c3)] data-[active=true]:text-[color:var(--c1)] data-[active=true]:hover:bg-[color-mix(in_oklab,var(--c3)_60%,transparent)]`;

/**
 * The bar itself: one outline and one surface around the whole row, so the
 * controls read as a single object rather than four floating ones.
 *
 * `overflow-hidden` is what lets the end segments take the bar's radius
 * without either of them naming a corner of its own.
 */
const HOST_BAR_CORE = `overflow-hidden p-3 invite:gap-3 ${HOST_SKIN} elevation-btn`;

/**
 * The same bar where it also has to serve as the page's top bar: below the
 * breakpoint it spans the width and squares off, since there is nothing
 * beside it for a floating pill to float over. The segments stay centred.
 *
 * The radius is stated once plain and once on the breakpoint rather than
 * twice in the same utility group — Tailwind emits variants after the
 * unprefixed rules, so the wide screen's `rounded-sm` wins by cascade order
 * rather than by where it sits in this string.
 */
export const HOST_BAR_TOP = `flex w-full ${HOST_BAR_CORE} invite:inline-flex invite:w-auto invite:rounded-sm`;

/** The box a text segment sits in, on its own so a segment can take the size
 * without the fill — see `HOST_TOGGLE`. */
const HOST_SEGMENT_BOX = "w-full invite:w-[140px] px-4 py-2";

/** The host's Edit/Save segments — same width as each other, side by side. */
export const HOST_ACTION = `${HOST_SEGMENT} ${HOST_SEGMENT_BOX}`;

/**
 * The Edit segment where the form it opens covers the whole screen. The
 * segment is behind that form the moment it is pressed, so the fill has
 * nothing to say and only shows up as a flicker under the panel sliding
 * over it — the active rules exist above the breakpoint alone, where the
 * form opens beside the bar and the segment stays in sight.
 *
 * Stated as a variant-only rule rather than an override below it: two
 * `data-[active=true]:bg-*` utilities would be one group settled by
 * Tailwind's emit order, not by this string. For the same reason it is built
 * from `HOST_SEGMENT_CORE` and the box, never from `HOST_ACTION` — that one
 * carries the unprefixed active fill, which no variant here could take back
 * below the breakpoint.
 */
export const HOST_TOGGLE = `${HOST_SEGMENT_CORE} ${HOST_SEGMENT_BOX} invite:data-[active=true]:bg-[var(--c3)] invite:data-[active=true]:text-[color:var(--c1)] invite:data-[active=true]:hover:bg-[color-mix(in_oklab,var(--c3)_60%,transparent)]`;

/*
 * A guest's checkbox: the native input, so keyboard and screen readers work
 * as ever, with the browser's look taken off and the palette's drawn in. A
 * square `--c1` outline; checked, a `--c3` fill with a thin `--c1` tick — the
 * input's own `::before`, scaled in when picked.
 */
export const CHECKBOX =
  "grid size-4 shrink-0 cursor-pointer appearance-none place-content-center rounded-[2px] border-1 border-[var(--c1)] bg-transparent transition-colors checked:bg-[var(--c3)] before:size-2.5 before:scale-0 before:bg-[var(--c1)] before:transition-transform before:[clip-path:polygon(0_56%,40%_96%,100%_22%,90%_12%,40%_76%,10%_46%)] checked:before:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c3)]";

/** One person in the reply: their name, then their own answers, with a `--c2` line under them. */
/** One person in the reply: their name, then their own answers. */
export const PERSON = "flex flex-col gap-4";

/*
 * The guest list's dropdown, dressed in the invitation's palette: the toggle
 * is a boxed guest field, and the list opens in a `--c4` outline on a `--c4`
 * fill, its options laid out in columns. `--c4` is see-through, so the fill
 * is laid over `--c1`: on its own the fields under the open list would show
 * through it.
 */
const DROPDOWN_PANEL =
  "absolute inset-x-0 top-full z-10 mt-1 grid border-1 border-[var(--c4)] [background:linear-gradient(var(--c4),var(--c4)),var(--c1)] py-1 shadow-sm";
/** One option: `--c1` words in the invitation's primary face, like the fields, filled `--c3` under the pointer. */
const DROPDOWN_OPTION =
  "flex cursor-pointer items-center gap-2 px-3 py-1.5 text-[14px] text-[color:var(--c1)] font-[family-name:var(--font-primary)] font-medium transition-colors hover:bg-[var(--c3)]";
const DROPDOWN_BASE = {
  label: `${REPLY_LABEL} mb-2 block`,
  toggle: `${BOXED_INPUT} flex cursor-pointer items-center justify-between gap-2 text-left`,
  placeholder: "text-[color:color-mix(in_oklab,var(--c4)_60%,transparent)]",
  chevron: "text-[color:var(--c4)]",
};

/** Dietary needs: several picks, ticked with the guest checkbox, in two columns. */
export const DIET_DROPDOWN = {
  ...DROPDOWN_BASE,
  panel: `${DROPDOWN_PANEL} grid-cols-2`,
  option: DROPDOWN_OPTION,
  tick: CHECKBOX,
};

/**
 * Age: one pick, one option a row, and no radios to see — the radio stays for
 * the keyboard and screen readers, hidden, and the option itself shows it:
 * solid `--c3` once picked, like the hover, and a `--c3` outline while it
 * has focus.
 */
export const AGE_DROPDOWN = {
  ...DROPDOWN_BASE,
  panel: DROPDOWN_PANEL,
  option: `${DROPDOWN_OPTION} has-checked:bg-[var(--c3)] has-focus-visible:outline-1 has-focus-visible:-outline-offset-1 has-focus-visible:outline-[var(--c3)]`,
  tick: "sr-only",
};

/**
 * Add person: the guest list's small button, solid `--c3` with `--c1` text in
 * Work Sans, uppercase, fading on hover like the Coming / Not coming
 * outline does. `transition-all` for the same reason as the buttons above: the
 * hover is an opacity.
 */
export const ADD_PERSON =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-sm border-1 border-[var(--c3)] bg-[var(--c3)] px-3 py-1.5 font-sans text-[11px] font-semibold tracking-[0.06em] whitespace-nowrap uppercase text-[color:var(--c1)] transition-all duration-200 hover:opacity-60";

/**
 * The reply surface's width, edge included — `--spacing-invite-panel`, so the
 * host controls can centre themselves over the slot this leaves. The host's
 * edit form reuses it exactly so the invitation does not move when the two
 * swap.
 *
 * Breakpointed, because below `--breakpoint-invite` both panels span the
 * viewport instead: a width there would over-constrain their `inset-inline`
 * and pull them off the right edge.
 */
export const PANEL = "invite:w-invite-panel invite:shrink-0";

/**
 * The edit panel's header row — its tabs, then the X: the host bar's box and
 * spacing — its padding, and the gap it opens above the breakpoint — without
 * the bar's shadow. On phones — screens under 500px — its sides pull in to
 * 8px so the tabs get the width.
 */
export const PANEL_TABS = `flex shrink-0 overflow-hidden rounded-sm px-2 py-3 min-[500px]:px-3 invite:gap-3 ${HOST_SKIN}`;

/** One tab in that row: a host-bar segment, sharing the row evenly. The open tab takes its active fill. */
export const PANEL_TAB = `${HOST_SEGMENT} flex-1 px-4 py-2`;

/** The X at the end of that row: a segment only as wide as its icon. */
export const PANEL_CLOSE = `${HOST_SEGMENT} shrink-0 px-4 py-2`;
