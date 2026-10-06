import { FIELD } from "@/components/dashboard/event-editor/styles";
import { SUMMARY_SURFACE } from "@/components/dashboard/event-editor/SummarySwitch";

/**
 * A section's styles, each a band glued under its row: no fill, only the
 * edge; hovered, gold. The current one is marked by its tick. No top edge:
 * the band above draws that line. Two edges overlapped by a pixel land a
 * pixel apart on a scaled screen and read as a thick line. The focus ring
 * is the keyboard's only: a click leaves none.
 */
export const DESIGN_BAND = `${FIELD} flex cursor-pointer items-center justify-between gap-2 border-t-0 border-mustard-300 text-left outline-mustard-400 bg-transparent hover:bg-mustard-300 focus:not-focus-visible:outline-none`;

/**
 * The Design tab's own summary box: the event editor's row, shorter, as the
 * side panel is a tighter place than the event page.
 */
const DESIGN_BOX = `${SUMMARY_SURFACE} min-h-[50px] py-2`;

/** The box as one button that opens what is under it (template, palette, pattern). */
export const DESIGN_BOX_BUTTON = `${DESIGN_BOX} group flex w-full cursor-pointer items-center gap-4 text-left transition-colors hover:bg-mustard-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mustard-500`;
