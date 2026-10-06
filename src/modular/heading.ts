import type { ScalarField } from "@/types/modular";
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
