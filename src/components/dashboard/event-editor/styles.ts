/**
 * Shared form presentation for the event editor. Kept in one place so a
 * change to the way inputs look lands on every field at once.
 */

/** Two fields abreast once the section is wide enough to hold both. */
export const FIELD_GRID =
  "grid grid-cols-1 gap-4 gap-x-5 @min-[820px]:grid-cols-2";

/** One fixed height for every single-line field (dates and selects otherwise size themselves); textareas keep growing. */
export const FIELD =
  "w-full border px-3 [&:not(textarea)]:h-10 py-[9px] text-[13.5px] text-neutral-900 transition-colors focus:outline-2 focus:-outline-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-800";
export const INPUT = `${FIELD} border-mustard-300 bg-neutral-50 outline-mustard-400 hover:border-mustard-500 focus:border-mustard-400 disabled:border-mustard-300`;

/** Field labels and the standalone legends above a group of controls. */
export const LABEL =
  "text-[10px] font-semibold tracking-[0.14em] text-neutral-800 uppercase";

/** The explanatory line under a field. */
export const HINT = "text-[11.5px] leading-[1.45] text-neutral-700";

export const ERROR = "text-[11.5px] font-medium text-rust-600";

/** The gold action's colours ("Stop using the list", "Different person", the list box's Save), at any size. Hovered, the fill takes the border's shade. */
export const GOLD_BTN =
  "border-mustard-300 bg-mustard-200 text-mustard-600 hover:bg-mustard-300";
/** The gold action as a button ("Close earlier", the Content tab's Change photo). Callers add its width. */
export const GOLD_ACTION = `cursor-pointer rounded-sm border px-2.5 py-[12px] text-center text-sm leading-[1.3] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${GOLD_BTN}`;
/** The gold action's outline pair: a pale fill, and on hover the same fill as the gold action's hover. */
export const GOLD_OUTLINE =
  "border-mustard-300 bg-neutral-50 text-mustard-600 hover:bg-mustard-300";
/** A pick among gold outline buttons: the gold action's fill once picked (`aria-pressed`). */
export const GOLD_PICK = `${GOLD_OUTLINE} aria-pressed:bg-mustard-200 aria-pressed:hover:bg-mustard-300`;
/**
 * A side panel's choice buttons (Flat / Folded): the gold outline pair,
 * a gold fill once picked (`aria-pressed`). As tall as a text field beside
 * them — its 9px padding, its 13.5px type and its 1px border.
 */
export const PANEL_CHOICE = `inline-flex cursor-pointer items-center justify-center border px-4 py-[9px] text-[13.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard-500 ${GOLD_PICK}`;

/** The big buttons' shape, without colours: every variant below builds on it. */
export const BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const BTN_PRIMARY = `${BUTTON} border-forest-500 bg-forest-500 text-neutral-50 hover:border-forest-600 hover:bg-forest-600`;
/* The outlined action borrows the solid one's fill for its edge. */
const OUTLINE = `${BUTTON} border-forest-500 text-forest-500 hover:border-forest-600 hover:bg-forest-200 hover:text-forest-600`;
export const BTN_GHOST = `${OUTLINE} bg-mustard-50`;
/** The same outline on the inputs' lighter fill, to sit in a row with them. */
export const BTN_GHOST_LIGHT = `${OUTLINE} bg-neutral-50`;
/** The top bar's own dark, for a page action that should read apart from the forest ones. */
export const BTN_DARK = `${BUTTON} border-neutral-900 bg-neutral-900 text-neutral-50 hover:border-neutral-800 hover:bg-neutral-800`;
export const BTN_DANGER = `${BUTTON} border-rust-500 bg-rust-100 text-rust-500 hover:bg-rust-500 hover:text-neutral-50`;

/** A borderless input inside a framed box that carries the border (the link address, the password). */
export const INSET_INPUT =
  "min-w-0 flex-1 self-stretch border-0 bg-transparent px-3 text-[13.5px] text-neutral-900 focus:outline-2 focus:-outline-offset-2 focus:outline-mustard-400 disabled:cursor-not-allowed";

/** The small icon-only control that sits inside a field. */
export const MINI =
  "grid place-items-center text-neutral-700 transition-colors hover:text-forest-500";

/** A panel that hangs off the control above it, sharing its edge. */
export const SUBBOX = "-mt-px border border-mustard-300 p-4";

/** Frozen states are grey, deadlines amber, explanations teal, notices gold. */
export type BannerTone = "frozen" | "warn" | "info" | "gold";

/** A banner's colours, also worn by the print panel's instructions. */
export const BANNER_TONE: Record<BannerTone, string> = {
  frozen: "border-neutral-500 bg-neutral-300 text-neutral-800",
  warn: "border-terracotta-400 bg-terracotta-200 text-terracotta-600",
  info: "border-steel-400 bg-steel-200 text-steel-600",
  gold: "border-mustard-500 bg-mustard-200 text-mustard-600",
};

const BAR_BUTTON =
  "inline-flex items-center justify-center rounded-md border px-4 py-2.5 font-medium transition-colors";

/** The save bar's buttons, also worn by the invitation editors' top bar. */
export const BAR_OUTLINE = `${BAR_BUTTON} border-mustard-400 bg-transparent text-mustard-400 hover:bg-mustard-50/10`;
export const BAR_SOLID = `${BAR_BUTTON} border-mustard-400 bg-mustard-400 font-semibold text-neutral-900 hover:border-mustard-300 hover:bg-mustard-300`;
/** The side panel's View, in the open tab's colours: dark fill, pale type. */
export const BAR_DARK = `${BAR_BUTTON} border-neutral-900 bg-neutral-900 font-semibold text-mustard-100 hover:border-neutral-800 hover:bg-neutral-800`;
export const BAR_DISABLED = `${BAR_BUTTON} cursor-not-allowed border-neutral-800 bg-transparent text-neutral-700`;

/** The status dot: terracotta while there is something to save, green once there isn't. */
export function stateDot(dirty: boolean) {
  return `size-[7px] shrink-0 rounded-full ${dirty ? "bg-terracotta-400" : "bg-forest-400"}`;
}
