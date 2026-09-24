/** Guest-list controls, on top of the event editor's shared form styles. */

export const CHIP =
  "inline-flex cursor-pointer items-center border px-3 py-1.5 text-[12.5px] font-medium transition-colors";
export const CHIP_ON = "border-forest-500 bg-forest-500 text-neutral-50";
export const CHIP_OFF =
  "border-mustard-300 bg-neutral-50 text-neutral-800 hover:border-mustard-500";

/** The small gold action the editor's "Edit list" uses. */
export const SMALL_BTN =
  "inline-flex cursor-pointer items-center gap-1.5 border border-mustard-400 bg-mustard-200 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-mustard-600 transition-colors hover:border-mustard-500";

/** Something on a row to sort out: what it is, then the ways to resolve it. */
export const ISSUE =
  "inline-flex flex-wrap items-center gap-2 border border-terracotta-400 bg-terracotta-200 py-1 pr-1 pl-2.5";
export const ISSUE_LABEL =
  "text-[10px] font-semibold tracking-[0.12em] text-terracotta-600 uppercase";

/** Name · reply or invite sent · unknown · duplicate · edit, the same on every row. */
export const COLUMNS =
  "@min-[720px]:grid @min-[720px]:grid-cols-[minmax(0,1fr)_120px_260px_270px_70px] @min-[720px]:gap-x-4";

