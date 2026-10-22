import { INFO_DARK, WARNING_DARK } from "@/components/dashboard/styles";

/**
 * Shared form presentation for the event editor. Kept in one place so a
 * change to the way inputs look lands on every field at once.
 */

/** One fixed height for every single-line field (dates and selects otherwise size themselves), its text centred without padding so a select's descenders are not cut; textareas keep growing. */
export const FIELD =
  "w-full rounded-ui border px-3 [&:not(textarea)]:h-input [&:not(textarea)]:py-0 py-[9px] field-text transition-colors focus:outline-2 focus:-outline-offset-1 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-800";
export const INPUT = `${FIELD} side-scroll [--scroll-track:var(--color-neutral-50)] font-normal border-neutral-400 bg-neutral-50 outline-neutral-500 hover:border-neutral-600 focus:border-neutral-500 disabled:border-neutral-400 date-icon`;

/** Field labels and the standalone legends above a group of controls. */
export const LABEL = "label-caps";

export const ERROR = "hint-face font-medium text-danger-800";

/** The soft action's colours ("Stop using the list", "Different person", the list box's Save), at any size. Hovered, the fill darkens two steps. */
export const SOFT_BTN =
  "border-neutral-400 bg-neutral-200 text-neutral-700 hover:bg-neutral-400 hover:text-neutral-800";
/** The soft action's shape and type, without colours. */
export const SOFT_ACTION_SHAPE =
  "inline-flex min-h-btn cursor-pointer items-center justify-center rounded-ui border px-2.5 py-2 text-center button-text leading-[1.3] transition-colors disabled:cursor-not-allowed disabled:opacity-50";
/** The soft action as a button ("Close earlier", the Content tab's Change photo). Callers add its width. */
export const SOFT_ACTION = `${SOFT_ACTION_SHAPE} ${SOFT_BTN}`;
/** The soft action's outline pair: a pale fill, and on hover the same fill as the soft action's hover. */
export const SOFT_OUTLINE =
  "border-neutral-400 bg-neutral-50 text-neutral-700 hover:bg-neutral-400 hover:text-neutral-800";
/** A pick among soft outline buttons: the soft action's fill once picked (`aria-pressed`). */
export const SOFT_PICK = `${SOFT_OUTLINE} aria-pressed:bg-neutral-200 aria-pressed:hover:bg-neutral-400`;

/** The big buttons' shape, without colours: every variant below builds on it. */
export const BUTTON =
  "inline-flex h-btn items-center justify-center gap-2 rounded-ui border px-4 button-text transition-colors disabled:cursor-not-allowed disabled:opacity-50";

/** The main action: in the accent colour, like every dashboard link. */
export const BTN_PRIMARY = `${BUTTON} border-accent-800 bg-accent-800 text-neutral-50 hover:border-accent-900 hover:bg-accent-900`;
/** The outlined action, the main one's fill colour for its edge and words, on the inputs' fill to sit in a row with them. */
export const BTN_GHOST_LIGHT = `${BUTTON} border-accent-800 bg-neutral-50 text-accent-800 hover:border-accent-950 hover:bg-accent-150 hover:text-accent-950`;
export const BTN_DANGER = `${BUTTON} border-danger-800 bg-danger-800 text-neutral-50 hover:border-danger-900 hover:bg-danger-900`;

/** A borderless input inside a framed box that carries the border (the link address, the password). */
export const INSET_INPUT =
  "min-w-0 flex-1 self-stretch border-0 bg-transparent px-3 field-text focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 disabled:cursor-not-allowed";

/** The small icon-only control that sits inside a field. */
export const MINI =
  "grid place-items-center text-neutral-700 transition-colors hover:text-accent-700";

/** A panel that hangs off the control above it, sharing its edge. */
export const SUBBOX = "-mt-px rounded-b-ui border border-secondary-300 p-4";

/** Deadlines, explanations and plain notices, each in its own tone. */
export type BannerTone = "warn" | "info" | "notice";

/** A banner's title, in the banner's own small type: also the info and warning boxes' titles. */
export const BANNER_TITLE = "mb-[3px] block item-face leading-[1.5]";

/** A banner's colours, also worn by the print panel's instructions. */
export const BANNER_TONE: Record<BannerTone, string> = {
  warn: WARNING_DARK,
  info: INFO_DARK,
  notice: "border-secondary-500 bg-secondary-200 text-secondary-600",
};

/** Each banner tone's icon colour: a plain icon, as on the Overview's to-dos. */
export const BANNER_ICON: Record<BannerTone, string> = {
  warn: "text-warning-600",
  info: "text-info-600",
  notice: "text-secondary-600",
};
