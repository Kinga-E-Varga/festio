import {
  BUTTON,
  ICON_BTN,
  SOFT_BTN,
  SMALL_BTN_SHAPE,
  SOFT_ACTION_SHAPE,
  SOFT_OUTLINE,
} from "@/components/dashboard/styles";

/** Guest-list controls, on top of the event editor's shared form styles. */

/** The warning prompts' small pair (`SMALL_BTN_WARN`) in danger's colours, for a delete's confirm and the reply editor's Delete reply: the danger zone's red for the fill, the edge and the words. */
export const SMALL_BTN_DANGER = `${SMALL_BTN_SHAPE} border-danger-800 text-danger-800 hover:border-danger-900 hover:text-danger-900`;
export const SMALL_BTN_DANGER_SOLID = `${SMALL_BTN_SHAPE} border-danger-800 bg-danger-800 text-danger-150 hover:border-danger-900 hover:bg-danger-900`;

/**
 * A shared name's Different person and the toolbar's outlined actions,
 * apart from the page's primary actions: the big shape in the soft action's
 * colours.
 */
export const BTN_LIST = `${BUTTON} ${SOFT_BTN}`;
export const BTN_LIST_OUTLINE = `${BUTTON} ${SOFT_OUTLINE}`;

/** The small soft action: the row editor's "Add person", an unknown reply's Match to and Add as new, the Add names box's Add. */
export const SMALL_BTN = `${SMALL_BTN_SHAPE} ${SOFT_BTN}`;
/** Its outline pair: the Add names box's Clear. */
export const SMALL_BTN_OUTLINE = `${SMALL_BTN_SHAPE} ${SOFT_OUTLINE}`;
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
