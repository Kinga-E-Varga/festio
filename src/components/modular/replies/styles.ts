import { BUTTON } from "@/components/dashboard/styles";
import { BOX_GAP, DESIGN_BOX } from "../design/styles";

/**
 * A question's bar in the Form tab: the Design tab's box, the handle in its
 * mark slot, the wording, and the arrow that opens its form.
 */
export const QUESTION_ROW = `${DESIGN_BOX} relative flex items-center ${BOX_GAP}`;

/** A label over a field in the question form, like the dashboard's dropdowns. */
export const FORM_LABEL = "mb-1.5 block label-caps";

/**
 * A suggestion's chip: the guest list's outlined button, dashed, its edge a
 * shade darker and its hover lighter. One already added fades (`opacity-60`).
 */
export const SUGGESTION_CHIP = `${BUTTON} border-dashed border-neutral-500 bg-neutral-50 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-800`;
