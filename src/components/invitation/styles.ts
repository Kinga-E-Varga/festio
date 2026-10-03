import type { RsvpSkin } from "./RsvpForm";

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

/**
 * A boxed field — the reply's names, dropdowns, Other box and note: a `--c4`
 * border on `--c4` at 5%, written in `--c3`, its placeholder `--c4` at 60%. Focus turns the border
 * `--c3`. The 24px line is stated, not left to the font, so the Coming
 * buttons — which name the same line — stand exactly as tall. In the
 * invitation's primary face; the reply's buttons stay in Work Sans.
 */
export const BOXED_INPUT = `${FIELD_SHAPE} ${REPLY_TYPE} leading-[24px] border-1 border-[var(--c4)] bg-[color-mix(in_oklab,var(--c4)_5%,transparent)] px-3 text-[color:var(--c3)] placeholder:text-[color:color-mix(in_oklab,var(--c4)_60%,transparent)]`;

const LABEL_CORE = "text-[11px] font-semibold tracking-[0.16em] uppercase";

/** The reply form's labels, in `--c4`. */
export const REPLY_LABEL = `${LABEL_CORE} text-[color:var(--c4)]`;

const HINT_CORE = "text-[12px] leading-[1.45] text-justify";

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

const BUTTON = `${BUTTON_CORE} rounded-sm border-1 px-5 py-3`;

/** The reply's Send — solid `--c2`, easing to the palette's hover colour `--c5`. */
export const SOLID = `${BUTTON} border-[var(--c2)] bg-[var(--c2)] text-[var(--c1)] hover:bg-[var(--c5)] hover:border-[var(--c5)]`;

/*
 * The reply's Coming / Not coming: in `--c3`, square, only as wide as
 * their words, and as tall as a boxed field — its padding,
 * its 24px line and its 1px border. The words are Work Sans at 12px, like Send,
 * uppercase: 550 when picked, 450 when not. `transition-all` because the
 * hover is an opacity.
 */
const ATTEND = `inline-flex cursor-pointer items-center justify-center border-1 border-[var(--c3)] px-5 py-[6px] font-sans text-[12px] leading-[24px] tracking-[0.1em] uppercase transition-all duration-200`;
export const ATTEND_SOLID = `${ATTEND} font-[550] bg-[var(--c3)] text-[color:var(--c1)]`;
export const ATTEND_OUTLINE = `${ATTEND} font-[450] text-[color:var(--c3)] hover:text-[color:var(--c1)] hover:bg-[var(--c3)] hover:opacity-60`;

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

/** The × beside a name: `--c4`, `--c3` under the pointer. */
const REMOVE_NAME =
  "text-[color:var(--c4)] transition-colors hover:text-[color:var(--c3)]";

/** The one warning above Send, in the palette's warning colour `--c6`. */
const WARNING = "text-[12px] text-center leading-[1.45] text-[color:var(--c6)]";

/** A simple invitation's reply form, every part in the template's `--c*`. */
export const SIMPLE_RSVP_SKIN: RsvpSkin = {
  label: REPLY_LABEL,
  input: BOXED_INPUT,
  choice: { picked: ATTEND_SOLID, unpicked: ATTEND_OUTLINE },
  remove: REMOVE_NAME,
  addPerson: ADD_PERSON,
  submit: SOLID,
  privacy: PRIVACY_HINT,
  warning: WARNING,
  space: { group: "gap-10", field: "gap-2", legend: "mb-3", send: "-mt-5" },
  age: AGE_DROPDOWN,
  diet: DIET_DROPDOWN,
};

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
