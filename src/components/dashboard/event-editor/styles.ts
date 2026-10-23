import { BUTTON, type BannerTone } from "@/components/dashboard/styles";

/** The event editor's own form presentation; what other screens share lives in `../styles.ts`. */

export const BTN_DANGER = `${BUTTON} border-danger-800 bg-danger-800 text-neutral-50 hover:border-danger-900 hover:bg-danger-900`;

/** A borderless input inside a framed box that carries the border (the link address, the password). */
export const INSET_INPUT =
  "min-w-0 flex-1 self-stretch border-0 bg-transparent px-3 field-text focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-500 disabled:cursor-not-allowed";

/** Each banner tone's icon colour: a plain icon, as on the Overview's to-dos. */
export const BANNER_ICON: Record<BannerTone, string> = {
  warn: "text-warning-600",
  info: "text-info-600",
  notice: "text-secondary-600",
};
