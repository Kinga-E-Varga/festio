import type { ScalarField, SectionValues } from "@/types/modular";
import { LABELS } from "./labels";

/**
 * The four heading fields every section heading has, declared once. Any of
 * them may be empty — `SectionHeading` draws only what is there.
 */
export const HEADING_FIELDS: readonly ScalarField[] = [
  { id: "eyebrow", label: LABELS.eyebrow, type: "text", maxLength: 60 },
  { id: "heading", label: LABELS.heading, type: "text", maxLength: 80 },
  {
    id: "headingItalic",
    label: LABELS.headingItalic,
    type: "text",
    maxLength: 80,
  },
  { id: "note", label: LABELS.note, type: "longText", maxLength: 240 },
];

/** Every heading field: what a variant drawing `SectionHeading` shows. */
export const HEADING_SHOWS = HEADING_FIELDS.map(({ id }) => id);

/** `IconHeading` leaves the eyebrow out. */
export const ICON_HEADING_SHOWS = HEADING_SHOWS.filter(
  (id) => id !== "eyebrow",
);

/**
 * `values` with the heading fields `shows` leaves out emptied: a variant
 * draws only the heading parts the Content tab offers for it. The same
 * object back when nothing needs emptying.
 */
export function shownHeading(
  values: SectionValues,
  shows: readonly string[],
): SectionValues {
  const hidden = HEADING_SHOWS.filter(
    (id) => !shows.includes(id) && values[id],
  );
  if (hidden.length === 0) return values;
  return { ...values, ...Object.fromEntries(hidden.map((id) => [id, ""])) };
}
