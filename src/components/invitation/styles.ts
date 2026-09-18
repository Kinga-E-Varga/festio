/**
 * Guest-facing chrome, styled entirely from the template's palette. Festio's
 * own colours and faces must never reach an invitation, so every value here
 * is a `var()` the template supplies.
 */

export const INPUT =
  'w-full border-b-1 border-[var(--c3)] bg-transparent py-[6px] text-[16px] text-[color:var(--c2)] font-[family-name:var(--font-primary)] transition-colors placeholder:text-[color:var(--c4)] focus:border-[var(--c2)] focus:outline-none'

export const LABEL =
  'text-[11px] font-semibold tracking-[0.16em] text-[color:var(--c3)] uppercase'

/** The line under a field — counters, limits, the privacy note. */
export const HINT =
  'text-[12px] leading-[1.45] text-[color:var(--c3)] text-justify'

/*
 * `transition-all`, not `transition-colors`: several of these hover on
 * `opacity` rather than a colour, and `transition-colors` doesn't cover it —
 * those buttons snapped instead of easing. Adding `transition-opacity` on the
 * variant below wouldn't fix it either, since both land in the same utility
 * group and Tailwind, not the class string's order, decides which wins.
 */
const BUTTON =
  'inline-flex items-center justify-center gap-2 px-5 py-3 text-[12px] font-semibold tracking-[0.16em] uppercase transition-all duration-200 rounded-xs border-1 disabled:cursor-not-allowed disabled:opacity-40'

export const SOLID = `${BUTTON} border-[var(--c2)] bg-[var(--c2)] text-[var(--c1)] hover:bg-[var(--c5)] hover:border-[var(--c5)]`
export const OUTLINE = `${BUTTON} border-[var(--c2)] text-[color:var(--c2)]  hover:text-[var(--c5)] hover:border-[var(--c5)]`

/** The going / not-going choice — c3 instead of the submit button's c2. */
export const TOGGLE_SOLID = `${BUTTON} border-[var(--c3)] bg-[var(--c3)] text-[color:var(--c1)]`
export const TOGGLE_OUTLINE = `${BUTTON} border-[var(--c3)] text-[color:var(--c3)] hover:text-[color:var(--c1)] hover:bg-[var(--c3)] hover:opacity-60`

/** The host's Edit/Save controls floating over the card — same style, same width. */
export const HOST_ACTION = `${BUTTON} w-[100px] border-[var(--c3)] bg-[var(--c1)] text-[color:var(--c3)] hover:opacity-80`

/** The small text control that adds or drops a name row. */
export const QUIET =
  'inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.1em] text-[color:var(--c2)] uppercase transition-colors duration-200 hover:text-[color:var(--c3)]'

/**
 * The reply surface's width, edge included. The host's edit form reuses it
 * exactly so the invitation does not move when the two swap.
 *
 * Breakpointed, because below `--breakpoint-invite` both panels span the
 * viewport instead: a width there would over-constrain their `inset-inline`
 * and pull them off the right edge.
 */
export const PANEL = 'invite:w-[clamp(400px,33.333vw,700px)] invite:shrink-0'

export const TITLE =
  'font-[family-name:var(--font-primary)] text-[20px] text-center text-balance leading-[1.25] text-[color:var(--c3)] mb-6 '
