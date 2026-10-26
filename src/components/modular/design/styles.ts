import { FIELD } from "@/components/dashboard/styles";
import { SUMMARY_SURFACE } from "@/components/dashboard/event-editor/SummarySwitch";

/**
 * The Design tab's own summary box: the event editor's row, shorter, as the
 * side panel is a tighter place than the event page, and square like the
 * section cards.
 */
export const DESIGN_BOX = `${SUMMARY_SURFACE} min-h-[45px] rounded-none! py-2 pl-3!`;

/**
 * The gap between a box's mark slot, its text and its arrow: the same as
 * the box's left padding, so a mark has as much room before as after it.
 */
export const BOX_GAP = "gap-3";

/**
 * The slot at a box's left that holds its mark — an icon, a switch, a
 * number, a tick or a drag handle — centred, as wide as the switch, so
 * every box's text starts in the same place.
 */
export const MARK_SLOT = "grid w-8 shrink-0 place-items-center";

/**
 * A box's mark at its left: a Design box's icon, a Content card's number.
 * Callers add its width and what it draws.
 */
export const BOX_MARK = "h-[22px] shrink-0 text-neutral-500";

/** Their line, a touch heavier than the app icons' 1.5. */
export const BOX_MARK_STROKE = 1.75;

/**
 * A section's styles, each a band glued under its row: the row's neutral
 * fill; hovered, a darker neutral. The current one is ticked where the bars draw their
 * icons, so every name starts in line with the bars' names. No top edge:
 * the band above draws that line. Two edges overlapped by a pixel land a
 * pixel apart on a scaled screen and read as a thick line. The focus ring
 * is the keyboard's only: a click leaves none.
 */
export const DESIGN_BAND = `${FIELD} flex cursor-pointer items-center ${BOX_GAP} rounded-none! border-t-0 border-neutral-400 pl-3 text-left outline-neutral-400 bg-neutral-50 hover:bg-neutral-300 focus:not-focus-visible:outline-none`;

/**
 * The box as one button that opens what is under it (template, palette,
 * pattern).
 */
export const DESIGN_BOX_BUTTON = `${DESIGN_BOX} group flex w-full cursor-pointer items-center ${BOX_GAP} text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-500`;

/**
 * Every bar's surface in the side panel's tabs: the neutral-50 card, its
 * neutral edge and side padding, no padding above or below — a bar is as
 * tall as its `min-h-[45px]`.
 */
export const BAR_SURFACE =
  "border border-neutral-400 bg-neutral-50 pr-4 pl-3 text-neutral-800";

/**
 * A section's bar in the Design and Content tabs, the event editor's summary row: a neutral-50 card with a neutral
 * edge, the toggle where that row has an icon — a required section has
 * none, its name at the left — and the styles arrow on the right. On,
 * the whole bar brings the section into view and rolls its styles out
 * under it, sharing the edge; while they are out, it only rolls them back.
 * Hovered, it says "Change" or "Close" by the arrow, like the other Design
 * boxes.
 */
export const SECTION_CARD = `flex min-h-[45px] flex-col justify-center ${BAR_SURFACE}`;
/**
 * An on section's whole bar: a button laid over the card, under its
 * switches, which sit above it.
 */
export const SECTION_REVEAL =
  "absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-500";
export const SECTION_NAME = "text-[14px] font-medium text-neutral-800";
