import {
  WARNING_DARK,
  BUTTON,
  ICON_BTN,
  SOFT_BTN,
  SOFT_ACTION_SHAPE,
  SOFT_OUTLINE,
} from "@/components/dashboard/styles";

/** Guest-list controls, on top of the event editor's shared form styles. */

/** A row's Delete: the shared danger button, a shade lighter. */
export const GUEST_BTN_DANGER = `${BUTTON} border-danger-700 bg-danger-700 text-neutral-50 hover:border-danger-800 hover:bg-danger-800`;
/** Backing out of a delete: the same danger colour, outlined. */
export const GUEST_BTN_DANGER_OUTLINE = `${BUTTON} border-danger-700 bg-neutral-50 text-danger-800 hover:border-danger-800 hover:bg-danger-150 hover:text-danger-900`;

/** The small soft action the editor's "Edit list" uses. */
const SMALL_BTN_SHAPE =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-ui border px-3 py-1.5 button-text whitespace-nowrap transition-colors";
export const SMALL_BTN = `${SMALL_BTN_SHAPE} ${SOFT_BTN}`;
/** The same small action in the warning colour, for the prompts on a warning alert. */
export const SMALL_BTN_WARN = `${SMALL_BTN_SHAPE} border-warning-700 bg-warning-50 text-warning-700 hover:border-warning-800 hover:text-warning-800`;
/** Its solid pair, for the choice the prompt leans to. */
export const SMALL_BTN_WARN_SOLID = `${SMALL_BTN_SHAPE} border-warning-700 bg-warning-700 text-warning-50 hover:border-warning-800 hover:bg-warning-800`;
/** The unsaved-changes bar's pair, in one ink: Keep editing filled in the light warning, Discard as its words alone (the edge kept clear, so both stand the same size). */
export const SMALL_BTN_KEEP = `${SMALL_BTN_SHAPE} border-warning-300 bg-warning-300 text-warning-800 hover:border-warning-400 hover:bg-warning-400 hover:text-warning-900`;
export const SMALL_BTN_DISCARD = `${SMALL_BTN_SHAPE} border-transparent text-warning-800 hover:text-warning-950`;

/** A reply's status as a dot's fill: the Confirmed and Declined cards' own colours. */
export const STATUS_FILL = {
  going: "bg-primary-700",
  not_going: "bg-warning-500",
} as const;

/**
 * The preloaded list box's buttons, apart from the page's primary actions:
 * the big shape in the soft action's colours.
 */
export const BTN_LIST = `${BUTTON} ${SOFT_BTN}`;
export const BTN_LIST_OUTLINE = `${BUTTON} ${SOFT_OUTLINE}`;

/*
 * The row editor's small action: the list box's soft fill.
 */
const EDITOR_FILL = SOFT_BTN;
/** "Add person": the small action's shape in the editor's colours. */
export const SMALL_BTN_EDITOR = `${SMALL_BTN_SHAPE} ${EDITOR_FILL}`;
/** Remove a person: the quiet icon button. */
export const ICON_BTN_EDITOR = ICON_BTN;

/*
 * A pick among choices: the soft action ("Close earlier") once picked; before
 * that, its outline pair, on a pale fill.
 */
const CHOICE_SHAPE = `${SOFT_ACTION_SHAPE} focus-visible:outline-2 focus-visible:outline-neutral-500`;
export const CHOICE_OFF = `${CHOICE_SHAPE} ${SOFT_OUTLINE}`;
export const CHOICE_ON = `${CHOICE_SHAPE} ${SOFT_BTN}`;

/** A panel eases in, a short drop and a fade, instead of popping: the list box and the row editors. */
export const FADE_IN =
  "transition-[opacity,translate] duration-300 ease-out starting:-translate-y-2 starting:opacity-0 motion-reduce:transition-none";

/** Folds to nothing and back, height and fade together: a category, a row's details. Pair it with `inert` while folded. */
export const fold = (open: boolean) =>
  `grid transition-[grid-template-rows,opacity] duration-450 ease-panel motion-reduce:transition-none ${
    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
  }`;

/** The warning box that holds a prompt: the list box's and the row editor's. */
export const ALERT = `rounded-ui border px-4 py-3 meta-face ${WARNING_DARK}`;
