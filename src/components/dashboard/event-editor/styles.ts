/**
 * Shared form presentation for the event editor. Kept in one place so a
 * change to the way inputs look lands on every field at once.
 */

/** Two fields abreast once the section is wide enough to hold both. */
export const FIELD_GRID =
  "grid grid-cols-1 gap-4 gap-x-5 @min-[820px]:grid-cols-2";

export const INPUT =
  "w-full border border-mustard-300 bg-neutral-50 px-3 py-[9px] text-[13.5px] text-neutral-900 transition-colors hover:border-neutral-500 focus:border-forest-500 focus:outline-2 focus:-outline-offset-1 focus:outline-forest-500 disabled:cursor-not-allowed disabled:border-mustard-300 disabled:bg-neutral-300 disabled:text-neutral-800";

/** Field labels and the standalone legends above a group of controls. */
export const LABEL =
  "text-[10px] font-semibold tracking-[0.14em] text-neutral-800 uppercase";

/** The explanatory line under a field. */
export const HINT = "text-[11.5px] leading-[1.45] text-neutral-700";

export const ERROR = "text-[11.5px] font-medium text-rust-600";

const BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const BTN = `${BUTTON} border-forest-500 bg-mustard-50 text-forest-500 hover:border-forest-600 hover:bg-forest-200`;
export const BTN_PRIMARY = `${BUTTON} border-forest-500 bg-forest-500 text-neutral-50 hover:border-forest-600 hover:bg-forest-600`;
/* The outlined action borrows the solid one's fill for its edge. */
export const BTN_GHOST = `${BUTTON} border-forest-500 bg-transparent text-forest-500 hover:border-forest-600 hover:bg-mustard-50 hover:text-forest-600`;
export const BTN_DANGER = `${BUTTON} border-rust-500 bg-rust-100 text-rust-500 hover:bg-rust-500 hover:text-neutral-50`;

/** The small icon-only control that sits inside a field. */
export const MINI =
  "grid place-items-center text-neutral-700 transition-colors hover:text-forest-500";

/** A panel that hangs off the control above it, sharing its edge. */
export const SUBBOX =
  "-mt-px border border-mustard-300 bg-neutral-50 p-4";
