import { BUTTON, GOLD_BTN } from "@/components/dashboard/event-editor/styles";

/** Guest-list controls, on top of the event editor's shared form styles. */

export const CHIP =
  "inline-flex shrink-0 cursor-pointer items-center border px-3 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition-colors";
/** "Preloaded list" and "New reply": at least 160px, so they read as a pair; on small screens they fill the line. */
export const HEADER_BTN_WIDTH =
  "min-w-[160px] grow whitespace-nowrap @min-[560px]:grow-0";
export const CHIP_ON = "border-forest-500 bg-forest-500 text-neutral-50";
export const CHIP_OFF =
  "border-mustard-300 bg-neutral-50 text-neutral-800 hover:border-forest-500 hover:bg-forest-200";

/** The small gold action the editor's "Edit list" uses. */
const SMALL_BTN_SHAPE =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-sm border px-3 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition-colors";
export const SMALL_BTN = `${SMALL_BTN_SHAPE} ${GOLD_BTN}`;
/** The same small action in terracotta, for the prompts on a terracotta alert. */
export const SMALL_BTN_WARN = `${SMALL_BTN_SHAPE} border-terracotta-600 bg-mustard-50 text-terracotta-600 hover:border-terracotta-500 hover:text-terracotta-500`;
/** Its solid pair, for the choice the prompt leans to. */
export const SMALL_BTN_WARN_SOLID = `${SMALL_BTN_SHAPE} border-terracotta-600 bg-terracotta-600 text-mustard-50 hover:border-terracotta-500 hover:bg-terracotta-500`;

/** A small flag beside a name: Unknown, Duplicate. */
export const TAG =
  "border px-1.5 py-px text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase";
/** Unknown and Duplicate: the tags that mark a reply needing attention. */
export const ATTENTION_TAG = `${TAG} border-rust-300 bg-rust-100 text-rust-600`;

/** A row's one status: its reply, or where a waiting name's invitation stands. */
const BADGE_TYPE =
  "inline-flex border text-[12.5px] font-medium whitespace-nowrap";
const BADGE_PAD = "px-2.5 py-[3px]";
export const BADGE = `${BADGE_TYPE} items-center gap-1.5 ${BADGE_PAD}`;
/** The same badge with a full-height box as its left side; its words go in `BADGE_TEXT`. */
export const BOX_BADGE = `${BADGE_TYPE} items-stretch`;
export const BADGE_TEXT = BADGE_PAD;

/** The quiet icon-only actions at the end of a row. */
const ICON_BASE =
  "grid size-8 cursor-pointer place-items-center text-neutral-600 transition-colors";
export const ICON_BTN = `${ICON_BASE} hover:bg-mustard-200 hover:text-neutral-900`;
/** Delete: the same button, turning rust on hover. */
export const ICON_BTN_DANGER = `${ICON_BASE} hover:bg-rust-200 hover:text-rust-500`;

/**
 * The preloaded list box's buttons, apart from the page's forest actions:
 * the big shape in the gold action's colours.
 */
export const BTN_LIST = `${BUTTON} ${GOLD_BTN}`;
/** The gold action's outline pair: a pale fill, and on hover the same fill as the gold action's hover. */
const GOLD_OUTLINE =
  "border-mustard-300 bg-neutral-50 text-mustard-600 hover:bg-mustard-300";
export const BTN_LIST_OUTLINE = `${BUTTON} ${GOLD_OUTLINE}`;

/*
 * The row editor's buttons and choices: the list box's gold pair.
 * Unpicked reads like Cancel, picked like Save.
 */
const EDITOR_FILL = GOLD_BTN;
const EDITOR_OUTLINE = GOLD_OUTLINE;
export const BTN_EDITOR = `${BUTTON} ${EDITOR_FILL}`;
export const BTN_EDITOR_OUTLINE = `${BUTTON} ${EDITOR_OUTLINE}`;
/** "Add person": the small action's shape in the editor's colours. */
export const SMALL_BTN_EDITOR = `${SMALL_BTN_SHAPE} ${EDITOR_FILL}`;
/** Remove a person: the quiet icon button. */
export const ICON_BTN_EDITOR = ICON_BTN;

/* The inputs' own padding and type size, so a chip is as tall as the field beside it. */
const CHOICE_SHAPE =
  "cursor-pointer border px-3 py-[9px] text-[13.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-mustard-500";
export const CHOICE_OFF = `${CHOICE_SHAPE} ${EDITOR_OUTLINE}`;
export const CHOICE_ON = `${CHOICE_SHAPE} ${EDITOR_FILL}`;

/** A panel eases in, a short drop and a fade, instead of popping: the list box and the row editors. */
export const FADE_IN =
  "transition-[opacity,translate] duration-300 ease-out starting:-translate-y-2 starting:opacity-0 motion-reduce:transition-none";

/** Folds to nothing and back, height and fade together: a category, a row's details. Pair it with `inert` while folded. */
export const fold = (open: boolean) =>
  `grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
  }`;

/** The terracotta box that holds a prompt: the list box's and the row editor's. */
export const ALERT =
  "border border-terracotta-400 bg-terracotta-200 px-4 py-3 text-[12.5px] text-terracotta-600";
