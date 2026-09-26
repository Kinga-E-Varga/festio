/** Guest-list controls, on top of the event editor's shared form styles. */

export const CHIP =
  "inline-flex shrink-0 cursor-pointer items-center border px-3 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition-colors";
/** "Preloaded list" and "New reply": at least 160px, so they read as a pair; on small screens they fill the line. */
export const HEADER_BTN_WIDTH = "min-w-[160px] grow whitespace-nowrap @min-[560px]:grow-0";
export const CHIP_ON = "border-forest-500 bg-forest-500 text-neutral-50";
export const CHIP_OFF =
  "border-mustard-300 bg-neutral-50 text-neutral-800 hover:border-mustard-500";

/** The small gold action the editor's "Edit list" uses. */
export const SMALL_BTN =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-mustard-400 bg-mustard-200 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-mustard-600 transition-colors hover:border-mustard-500";

/** A small flag beside a name: Unknown, Duplicate. */
export const TAG =
  "border px-1.5 py-px text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase";
/** Unknown and Duplicate: the tags that mark a reply needing attention. */
export const ATTENTION_TAG = `${TAG} border-rust-300 bg-rust-100 text-rust-600`;

/** A row's one status: its reply, or where a waiting name's invitation stands. */
const BADGE_TYPE = "inline-flex border text-[12px] font-medium whitespace-nowrap";
const BADGE_PAD = "px-2.5 py-[3px]";
export const BADGE = `${BADGE_TYPE} items-center gap-1.5 ${BADGE_PAD}`;
/** The same badge with a full-height box as its left side; its words go in `BADGE_TEXT`. */
export const BOX_BADGE = `${BADGE_TYPE} items-stretch`;
export const BADGE_TEXT = BADGE_PAD;

/** The quiet icon-only actions at the end of a row. */
const ICON_BASE = "grid size-8 cursor-pointer place-items-center text-neutral-600 transition-colors";
export const ICON_BTN = `${ICON_BASE} hover:bg-mustard-200 hover:text-neutral-900`;
/** Delete: the same button, turning rust on hover. */
export const ICON_BTN_DANGER = `${ICON_BASE} hover:bg-rust-200 hover:text-rust-500`;

