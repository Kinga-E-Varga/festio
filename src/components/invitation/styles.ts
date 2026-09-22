/**
 * Guest-facing chrome, styled entirely from the template's palette. Festio's
 * own colours and faces must never reach an invitation, so every value here
 * is a `var()` the template supplies.
 */

/* Everything but the surface and the edge, so each field can name its own
 * without an override — two plain `bg-*` utilities, or a width on one side
 * against a width on all four, are settled by Tailwind's emit order rather
 * than by the class string. */
const FIELD_CORE =
  'w-full py-[6px] text-[16px] text-[color:var(--c3)] font-[family-name:var(--font-primary)] transition-colors placeholder:text-[color:var(--c4)] focus:border-[var(--c3)] focus:outline-none'

/** A one-line field: a rule under the text, nothing around it. */
export const INPUT = `${FIELD_CORE} border-b-1 border-[var(--c2)] bg-transparent`

/**
 * A field the host writes several lines into. Boxed rather than underlined,
 * because a rule under a block of text reads as a line through the middle of
 * the field as soon as the text wraps past it; the box holds the whole of
 * what is being written.
 *
 * `resize-none` is part of the style: the panels these sit in are a fixed
 * width, and a dragged corner would pull the field out of its column.
 */
export const TEXTAREA = `${FIELD_CORE} border-1 border-[var(--c2)] bg-transparent px-3 resize-none`

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
export const SELECT = `${FIELD_CORE} border-b-1 border-[var(--c2)] bg-[var(--c1)] [&>option]:bg-[var(--c3)] [&>option]:text-[color:var(--c1)] [&>option:hover]:bg-[var(--c2)] [&>option:hover]:text-[color:var(--c1)] [&>option:checked]:bg-[var(--c2)] [&>option:checked]:text-[color:var(--c1)]`

export const LABEL =
  'text-[11px] font-semibold tracking-[0.16em] text-[color:var(--c2)] uppercase'

/** The line under a field — counters, limits, the privacy note. */
export const HINT =
  'text-[12px] leading-[1.45] text-[color:var(--c2)] text-justify'

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
  'inline-flex items-center justify-center gap-2 text-[12px] font-semibold tracking-[0.16em] uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40'

/* Its own outline. The host bar's segments share one, so they start at CORE. */
const BUTTON_BASE = `${BUTTON_CORE} rounded-sm border-1`

const BUTTON = `${BUTTON_BASE} px-5 py-3`

export const SOLID = `${BUTTON} border-[var(--c2)] bg-[var(--c2)] text-[var(--c1)] hover:bg-[var(--c5)] hover:border-[var(--c5)]`

/** The going / not-going choice — c3 instead of the submit button's c2. */
export const TOGGLE_SOLID = `${BUTTON} border-[var(--c3)] bg-[var(--c3)] text-[color:var(--c1)]`
export const TOGGLE_OUTLINE = `${BUTTON} border-[var(--c3)] text-[color:var(--c3)] hover:text-[color:var(--c1)] hover:bg-[var(--c3)] hover:opacity-60`

/** The one skin every control in the host's bar wears, written once. */
const HOST_SKIN = 'border-[var(--c3)] bg-[var(--c1)] text-[color:var(--c3)]'

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
const HOST_DIVIDER = `relative before:pointer-events-none before:absolute before:content-[''] before:inset-y-0 before:left-0 before:w-px before:bg-[color-mix(in_oklab,var(--c3)_30%,transparent)] first:before:hidden invite:before:-left-[6.5px]`

const HOST_SEGMENT_CORE = `${BUTTON_CORE} ${HOST_DIVIDER} text-[color:var(--c3)] hover:bg-[color-mix(in_oklab,var(--c3)_15%,transparent)] hover:text-[color:var(--c3)]`

const HOST_SEGMENT = `${HOST_SEGMENT_CORE} data-[active=true]:bg-[var(--c3)] data-[active=true]:text-[color:var(--c1)] data-[active=true]:hover:bg-[color-mix(in_oklab,var(--c3)_60%,transparent)]`

/**
 * The bar itself: one outline and one surface around the whole row, so the
 * controls read as a single object rather than four floating ones.
 *
 * `overflow-hidden` is what lets the end segments take the bar's radius
 * without either of them naming a corner of its own.
 */
const HOST_BAR_CORE = `overflow-hidden p-3 invite:gap-3 ${HOST_SKIN} elevation-btn`

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
export const HOST_BAR_TOP = `flex w-full ${HOST_BAR_CORE} invite:inline-flex invite:w-auto invite:rounded-sm`

/** The box a text segment sits in, on its own so a segment can take the size
 * without the fill — see `HOST_TOGGLE`. */
const HOST_SEGMENT_BOX = 'w-full invite:w-[140px] px-4 py-2'

/** The host's Edit/Save segments — same width as each other, side by side. */
export const HOST_ACTION = `${HOST_SEGMENT} ${HOST_SEGMENT_BOX}`

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
export const HOST_TOGGLE = `${HOST_SEGMENT_CORE} ${HOST_SEGMENT_BOX} invite:data-[active=true]:bg-[var(--c3)] invite:data-[active=true]:text-[color:var(--c1)] invite:data-[active=true]:hover:bg-[color-mix(in_oklab,var(--c3)_60%,transparent)]`

/** The small text control that adds or drops a name row. */
export const QUIET =
  'inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.1em] text-[color:var(--c3)] uppercase transition-colors duration-200 hover:text-[color:var(--c2)]'

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
export const PANEL = 'invite:w-invite-panel invite:shrink-0'

export const TITLE =
  'font-[family-name:var(--font-primary)] text-[20px] text-center text-balance leading-[1.25] text-[color:var(--c3)] mb-6 '
