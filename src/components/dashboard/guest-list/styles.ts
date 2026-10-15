import { DANGER_DARK, WARNING_DARK } from "@/components/dashboard/styles";
import {
  BUTTON,
  SOFT_BTN,
  SOFT_ACTION_SHAPE,
  SOFT_OUTLINE,
} from "@/components/dashboard/event-editor/styles";

/** Guest-list controls, on top of the event editor's shared form styles. */

export const CHIP =
  "inline-flex shrink-0 cursor-pointer items-center rounded-ui border px-3 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition-colors";
/** "Edit invite list" and "New reply": at least 160px, never wrapping; their row makes them equal. */
export const HEADER_BTN_WIDTH = "min-w-[160px] whitespace-nowrap";
export const CHIP_ON = "border-primary-800 bg-primary-800 text-neutral-50";
export const CHIP_OFF =
  "border-neutral-400 bg-neutral-50 text-neutral-800 hover:border-primary-800 hover:bg-primary-200";

/** The page's solid action: the shared one, in the event tabs' green. */
export const GUEST_BTN_PRIMARY = `${BUTTON} border-primary-800 bg-primary-800 text-neutral-50 hover:border-primary-900 hover:bg-primary-900`;
/** A row's Delete: the shared danger button, a shade lighter. */
export const GUEST_BTN_DANGER = `${BUTTON} border-danger-700 bg-danger-700 text-neutral-50 hover:border-danger-800 hover:bg-danger-800`;

/** The small soft action the editor's "Edit list" uses. */
const SMALL_BTN_SHAPE =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-ui border px-3 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition-colors";
export const SMALL_BTN = `${SMALL_BTN_SHAPE} ${SOFT_BTN}`;
/** The same small action in the warning colour, for the prompts on a warning alert. */
export const SMALL_BTN_WARN = `${SMALL_BTN_SHAPE} border-warning-700 bg-warning-50 text-warning-700 hover:border-warning-800 hover:text-warning-800`;
/** Its solid pair, for the choice the prompt leans to. */
export const SMALL_BTN_WARN_SOLID = `${SMALL_BTN_SHAPE} border-warning-700 bg-warning-700 text-warning-50 hover:border-warning-800 hover:bg-warning-800`;

/** A small flag beside a name: Unknown, Duplicate. */
export const TAG =
  "rounded-ui border px-1.5 py-px text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase";
/** Unknown and Duplicate: the tags that mark a reply needing attention. */
export const ATTENTION_TAG = `${TAG} ${DANGER_DARK}`;

/** A row's one status: its reply, or where a waiting name's invitation stands. */
const BADGE_TYPE =
  "inline-flex rounded-ui border text-[12.5px] font-medium whitespace-nowrap";
const BADGE_PAD = "px-2.5 py-[3px]";
export const BADGE = `${BADGE_TYPE} items-center gap-1.5 ${BADGE_PAD}`;
/** The same badge with a full-height box as its left side; its words go in `BADGE_TEXT`. */
export const BOX_BADGE = `${BADGE_TYPE} items-stretch overflow-hidden`;
export const BADGE_TEXT = BADGE_PAD;

/** The quiet icon-only actions at the end of a row. */
const ICON_BASE =
  "grid size-8 cursor-pointer place-items-center rounded-ui text-neutral-600 transition-colors";
export const ICON_BTN = `${ICON_BASE} hover:bg-neutral-200 hover:text-neutral-950`;
/** Delete: the same button, turning danger on hover. */
export const ICON_BTN_DANGER = `${ICON_BASE} hover:bg-danger-200 hover:text-danger-600`;

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
  `grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
  }`;

/** The warning box that holds a prompt: the list box's and the row editor's. */
export const ALERT = `rounded-ui border px-4 py-3 text-[12.5px] ${WARNING_DARK}`;
