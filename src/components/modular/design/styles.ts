import { FIELD } from "@/components/dashboard/event-editor/styles";
import { SUMMARY_SURFACE } from "@/components/dashboard/event-editor/SummarySwitch";

/**
 * The Design tab's own summary box: the event editor's row, shorter, as the
 * side panel is a tighter place than the event page.
 */
const DESIGN_BOX = `${SUMMARY_SURFACE} min-h-[50px] py-2`;

/** The gap between a box's mark, its text and its arrow. */
export const BOX_GAP = "gap-4";

/**
 * A box's mark at its left: a Design box's icon, a Content card's number.
 * Callers add its width and what it draws.
 */
export const BOX_MARK = "h-[22px] shrink-0 text-mustard-500";

/** Their line, a touch heavier than the app icons' 1.5. */
export const BOX_MARK_STROKE = 1.75;

/**
 * A section's styles, each a band glued under its row: the row's neutral
 * fill; hovered, gold. The current one is ticked where the bars draw their
 * icons, so every name starts in line with the bars' names. No top edge:
 * the band above draws that line. Two edges overlapped by a pixel land a
 * pixel apart on a scaled screen and read as a thick line. The focus ring
 * is the keyboard's only: a click leaves none.
 */
export const DESIGN_BAND = `${FIELD} flex cursor-pointer items-center ${BOX_GAP} border-t-0 border-mustard-300 pl-5 text-left outline-mustard-400 bg-neutral-50 hover:bg-mustard-300 focus:not-focus-visible:outline-none`;

/**
 * The box as one button that opens what is under it (template, palette,
 * pattern).
 */
export const DESIGN_BOX_BUTTON = `${DESIGN_BOX} group flex w-full cursor-pointer items-center ${BOX_GAP} text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mustard-500`;

/**
 * A section's bar in the Design and Content tabs, the event editor's summary row: a neutral-50 card with a gold
 * edge, the toggle where that row has an icon — a required section has
 * none, its name at the left — and the styles arrow on the right. On,
 * the whole bar brings the section into view and rolls its styles out
 * under it, sharing the edge; while they are out, it only rolls them back.
 * Hovered, it says "Change" or "Close" by the arrow, like the other Design
 * boxes.
 */
export const SECTION_CARD =
  "flex min-h-[50px] flex-col justify-center border border-mustard-300 bg-neutral-50 py-1 pr-4 pl-5 text-neutral-800";
/**
 * An on section's whole bar: a button laid over the card, under its
 * switches, which sit above it.
 */
export const SECTION_REVEAL =
  "absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mustard-500";
export const SECTION_NAME = "text-[14px] font-medium text-neutral-800";
