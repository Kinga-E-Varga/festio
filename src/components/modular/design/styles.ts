import { FIELD } from "@/components/dashboard/event-editor/styles";
import { SUMMARY_SURFACE } from "@/components/dashboard/event-editor/SummarySwitch";
import {
  DASHBOARD_SKIN,
  type MultiSelectSkin,
} from "@/components/dashboard/guest-list/MultiSelect";

/**
 * The Design tab's dropdowns (a palette, a section's style): the guest
 * list's dropdown, glued under its row, its label left to screen readers.
 * Filled in soft gold; hovered, only the fill deepens — the edge stays.
 * No top edge: the row above draws that line. Two edges overlapped by a
 * pixel land a pixel apart on a scaled screen and read as a thick line.
 * The focus ring is the keyboard's only: a click leaves none.
 */
export const DESIGN_DROPDOWN: MultiSelectSkin = {
  ...DASHBOARD_SKIN,
  label: "sr-only",
  /*
   * The reply form's age dropdown in Festio's colours: no radio to see — it
   * stays for the keyboard and screen readers, hidden — and the option
   * itself shows it: the toggle's gold once picked, a gold outline while it
   * has keyboard focus.
   */
  option: `${DASHBOARD_SKIN.option} has-checked:bg-mustard-200 has-focus-visible:outline-1 has-focus-visible:-outline-offset-1 has-focus-visible:outline-mustard-500`,
  tick: "sr-only",
  toggle: `${FIELD} flex cursor-pointer items-center justify-between gap-2 border-t-0 border-mustard-300 bg-mustard-200 text-left outline-mustard-400 hover:bg-mustard-300 focus:not-focus-visible:outline-none`,
};

/**
 * The Design tab's own summary box: the event editor's row, shorter, as the
 * side panel is a tighter place than the event page.
 */
const DESIGN_BOX = `${SUMMARY_SURFACE} min-h-[50px] py-2`;

/** The box as one button that opens what is under it (template, palette, pattern). */
export const DESIGN_BOX_BUTTON = `${DESIGN_BOX} group flex w-full cursor-pointer items-center gap-4 text-left transition-colors hover:bg-mustard-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mustard-500`;
