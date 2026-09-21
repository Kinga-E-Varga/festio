/**
 * Guest-facing chrome, styled entirely from the template's palette. Festio's
 * own colours and faces must never reach an invitation, so every value here
 * is a `var()` the template supplies.
 */

/* Everything but the surface, so the select can name its own without an
 * override — two plain `bg-*` utilities on one element are settled by
 * Tailwind's emit order, not by the class string. */
const INPUT_CORE =
  'w-full border-b-1 py-[6px] text-[16px] text-[color:var(--c3)] font-[family-name:var(--font-primary)] transition-colors placeholder:text-[color:var(--c4)] focus:border-[var(--c3)] focus:outline-none'

export const INPUT = `${INPUT_CORE} border-[var(--c2)] bg-transparent`

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
export const SELECT = `${INPUT_CORE} border-[var(--c3)] bg-[var(--c1)] [&>option]:bg-[var(--c3)] [&>option]:text-[color:var(--c1)] [&>option:hover]:bg-[var(--c2)] [&>option:hover]:text-[color:var(--c1)] [&>option:checked]:bg-[var(--c2)] [&>option:checked]:text-[color:var(--c1)]`

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
const BUTTON_BASE = `${BUTTON_CORE} rounded-xs border-1`

const BUTTON = `${BUTTON_BASE} px-5 py-3`

export const SOLID = `${BUTTON} border-[var(--c2)] bg-[var(--c2)] text-[var(--c1)] hover:bg-[var(--c5)] hover:border-[var(--c5)]`
export const OUTLINE = `${BUTTON} border-[var(--c2)] text-[color:var(--c2)]  hover:text-[var(--c5)] hover:border-[var(--c5)]`

/** The going / not-going choice — c3 instead of the submit button's c2. */
export const TOGGLE_SOLID = `${BUTTON} border-[var(--c3)] bg-[var(--c3)] text-[color:var(--c1)]`
export const TOGGLE_OUTLINE = `${BUTTON} border-[var(--c3)] text-[color:var(--c3)] hover:text-[color:var(--c1)] hover:bg-[var(--c3)] hover:opacity-60`

/** The one skin every control in the host's bar wears, written once. */
const HOST_SKIN = 'border-[var(--c3)] bg-[var(--c1)] text-[color:var(--c3)]'

/**
 * What a segment inside the bar carries: ink and hover, no box of its own.
 *
 * Hover fills with `--c2` rather than dimming: the segments share the bar's
 * one surface, so an opacity change could only fade the glyph, which reads as
 * the control going away rather than answering. The ink turns over to `--c1`
 * with it — `--c2` is the tone `SOLID` already sets light text on.
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
const HOST_SEGMENT = `${BUTTON_CORE} text-[color:var(--c3)] hover:bg-[var(--c2)] hover:text-[color:var(--c1)] data-[active=true]:bg-[var(--c2)] data-[active=true]:text-[color:var(--c1)] data-[active=true]:hover:bg-[var(--c5))]`

/**
 * The bar itself: one outline and one surface around the whole row, so the
 * controls read as a single object rather than four floating ones.
 *
 * The separators hang on the container, not the buttons — `[&>*+*]` is every
 * segment but the first, which is the same rule stated as an omission. A
 * `border-l` on each segment undone by `first:border-l-0` would be an
 * override, and overrides here come down to which rule Tailwind emits last.
 *
 * `overflow-hidden` is what lets the end segments take the bar's radius
 * without either of them naming a corner of its own.
 */
export const HOST_BAR = `inline-flex overflow-hidden rounded-xs border-1 ${HOST_SKIN} elevation-btn [&>*+*]:border-l-1 [&>*+*]:border-[var(--c3)]`

/** The host's Edit/Save segments — same width as each other, side by side. */
export const HOST_ACTION = `${HOST_SEGMENT} w-[100px] px-5 py-3`

/**
 * The icon-only segments — Back and the X that dismisses the bar. Narrow
 * rather than `w-[100px]`: a lone glyph in a segment that wide reads as a gap
 * in the row, not a control. They keep `py-3` so their height is the text
 * segments' height by construction rather than by a number that has to be
 * kept in step with the type.
 */
export const HOST_ICON = `${HOST_SEGMENT} w-[44px] py-3`

/**
 * The handle the X leaves behind. It stands alone rather than in the bar, so
 * unlike the segments it draws its own outline and surface.
 *
 * A small handle centred over the bar it restores, not a second bar. Only the
 * bottom corners round — it sits flush against the top of the page, where the
 * top two would have nothing to round against.
 */
export const HOST_TAB = `${BUTTON_CORE} h-[26px] w-[44px] rounded-b-xs border-1 ${HOST_SKIN} elevation-btn hover:bg-[var(--c2)] hover:text-[color:var(--c1)]`

/** The small text control that adds or drops a name row. */
export const QUIET =
  'inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.1em] text-[color:var(--c2)] uppercase transition-colors duration-200 hover:text-[color:var(--c3)]'

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
