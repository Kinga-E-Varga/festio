import { INFO_DARK, WARNING_DARK } from "@/components/dashboard/styles";

/**
 * Shared form presentation for the event editor. Kept in one place so a
 * change to the way inputs look lands on every field at once.
 */

/** Two fields abreast once the section is wide enough to hold both. */
export const FIELD_GRID =
  "grid grid-cols-1 gap-4 gap-x-5 @min-[820px]:grid-cols-2";

/** One fixed height for every single-line field (dates and selects otherwise size themselves); textareas keep growing. */
export const FIELD =
  "w-full rounded-ui border px-3 [&:not(textarea)]:h-input py-[9px] text-[13.5px] text-neutral-950 transition-colors focus:outline-2 focus:-outline-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-800";
export const INPUT = `${FIELD} font-normal border-neutral-400 bg-neutral-50 outline-neutral-500 hover:border-neutral-600 focus:border-neutral-500 disabled:border-neutral-400 date-icon`;

/** Field labels and the standalone legends above a group of controls. */
export const LABEL = "label-caps";

/** The explanatory line under a field. */
export const HINT = "text-[11.5px] leading-[1.45] text-neutral-700";

export const ERROR = "text-[11.5px] font-medium text-danger-800";

/** The soft action's colours ("Stop using the list", "Different person", the list box's Save), at any size. Hovered, the fill darkens two steps. */
export const SOFT_BTN =
  "border-neutral-400 bg-neutral-200 text-neutral-700 hover:bg-neutral-400 hover:text-neutral-800";
/** The soft action's shape and type, without colours. */
export const SOFT_ACTION_SHAPE =
  "inline-flex min-h-btn cursor-pointer items-center justify-center rounded-ui border px-2.5 py-2 text-center text-[12.5px] leading-[1.3] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";
/** The soft action as a button ("Close earlier", the Content tab's Change photo). Callers add its width. */
export const SOFT_ACTION = `${SOFT_ACTION_SHAPE} ${SOFT_BTN}`;
/** The soft action's outline pair: a pale fill, and on hover the same fill as the soft action's hover. */
export const SOFT_OUTLINE =
  "border-neutral-400 bg-neutral-50 text-neutral-700 hover:bg-neutral-400 hover:text-neutral-800";
/** A pick among soft outline buttons: the soft action's fill once picked (`aria-pressed`). */
export const SOFT_PICK = `${SOFT_OUTLINE} aria-pressed:bg-neutral-200 aria-pressed:hover:bg-neutral-400`;

/** The big buttons' shape, without colours: every variant below builds on it. */
export const BUTTON =
  "inline-flex h-btn items-center justify-center gap-2 rounded-ui border px-4 text-[12.5px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const BTN_PRIMARY = `${BUTTON} border-primary-700 bg-primary-700 text-neutral-50 hover:border-primary-900 hover:bg-primary-900`;
/* The outlined action borrows the solid one's fill for its edge. */
const OUTLINE = `${BUTTON} border-primary-700 text-primary-700 hover:border-primary-900 hover:bg-primary-200 hover:text-primary-900`;
export const BTN_GHOST = `${OUTLINE} bg-secondary-100`;
/** The same outline on the inputs' lighter fill, to sit in a row with them. */
export const BTN_GHOST_LIGHT = `${OUTLINE} bg-neutral-50`;
/** The dashboard's "New event" colour, for a page action that should read apart from the primary ones. */
export const BTN_ACCENT = `${BUTTON} border-accent-800 bg-accent-800 text-neutral-50 hover:border-accent-900 hover:bg-accent-900`;
export const BTN_DANGER = `${BUTTON} border-danger-800 bg-danger-800 text-neutral-50 hover:border-danger-900 hover:bg-danger-900`;

/** A borderless input inside a framed box that carries the border (the link address, the password). */
export const INSET_INPUT =
  "min-w-0 flex-1 self-stretch border-0 bg-transparent px-3 text-[13.5px] text-neutral-950 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 disabled:cursor-not-allowed";

/** The small icon-only control that sits inside a field. */
export const MINI =
  "grid place-items-center text-neutral-700 transition-colors hover:text-primary-700";

/** A panel that hangs off the control above it, sharing its edge. */
export const SUBBOX = "-mt-px rounded-b-ui border border-secondary-300 p-4";

/** Deadlines, explanations and plain notices, each in its own tone. */
export type BannerTone = "warn" | "info" | "notice";

/** A banner's title, in the banner's own small type: also the info and warning boxes' titles. */
export const BANNER_TITLE =
  "mb-[3px] block text-[12.5px] leading-[1.5] font-semibold";

/** A banner's colours, also worn by the print panel's instructions. */
export const BANNER_TONE: Record<BannerTone, string> = {
  warn: WARNING_DARK,
  info: INFO_DARK,
  notice: "border-secondary-500 bg-secondary-200 text-secondary-600",
};

/** The solid square an info box leads with: the banners and the package boxes. Colours come from the tone. */
export const ICON_SQUARE =
  "grid size-[34px] shrink-0 place-items-center rounded-ui border";

/** Each banner tone's icon square: its text colour as a solid fill, a pale icon. */
export const BANNER_ICON: Record<BannerTone, string> = {
  warn: "border-warning-700 bg-warning-700 text-warning-50",
  info: "border-info-700 bg-info-700 text-info-50",
  notice: "border-secondary-600 bg-secondary-600 text-secondary-100",
};

const BAR_BUTTON =
  "inline-flex h-btn items-center justify-center rounded-ui border px-4 text-[12.5px] font-medium transition-colors";

/** The save bar's buttons, also worn by the invitation editors' top bar. */
export const BAR_OUTLINE = `${BAR_BUTTON} border-secondary-400 bg-transparent text-secondary-400 hover:bg-secondary-100/10`;
const BAR_SOLID_FILL = "border-secondary-400 bg-secondary-400 text-neutral-950";
export const BAR_SOLID = `${BAR_BUTTON} ${BAR_SOLID_FILL} hover:border-secondary-300 hover:bg-secondary-300`;
/** The solid action, faded to 40% while there is nothing to save. */
export const BAR_DISABLED = `${BAR_BUTTON} ${BAR_SOLID_FILL} cursor-not-allowed opacity-40`;

/** The status dot: warning while there is something to save, primary once there isn't. */
export function stateDot(dirty: boolean) {
  return `size-[7px] shrink-0 rounded-full ${dirty ? "bg-warning-400" : "bg-primary-400"}`;
}
