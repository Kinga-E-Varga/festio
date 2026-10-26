import { BUTTON } from "@/components/dashboard/styles";
import { BAR_SURFACE, BOX_GAP } from "../design/styles";

/**
 * A question's bar in the Form tab: a section card's surface and height,
 * the handle in its mark slot, the wording, and the arrow that opens its form.
 */
export const QUESTION_ROW = `${BAR_SURFACE} relative flex min-h-[45px] items-center ${BOX_GAP}`;

/** A label over a field in the question form, like the dashboard's dropdowns. */
export const FORM_LABEL = "mb-1.5 block label-caps";

/**
 * A suggestion's chip: the guest list's outlined button, dashed, its edge a
 * shade darker and its hover lighter. One already added fades (`opacity-60`).
 */
export const SUGGESTION_CHIP = `${BUTTON} border-dashed border-neutral-500 bg-neutral-50 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-800`;
