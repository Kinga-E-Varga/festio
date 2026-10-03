import type { LocalizedText } from "@/lib/language";
import type { ScalarField } from "@/types/modular";
import { LABELS } from "./labels";

/** A section's sample heading; a part left out starts empty. */
export interface HeadingCopy {
  eyebrow?: LocalizedText;
  heading?: LocalizedText;
  headingItalic?: LocalizedText;
  note?: LocalizedText;
}

/**
 * The four heading fields every section heading has, declared once. Any of
 * them may be empty — `SectionHeading` draws only what is there.
 */
export function headingFields(copy: HeadingCopy): ScalarField[] {
  return [
    {
      id: "eyebrow",
      label: LABELS.eyebrow,
      type: "text",
      maxLength: 60,
      fallback: copy.eyebrow ?? "",
    },
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 80,
      fallback: copy.heading ?? "",
    },
    {
      id: "headingItalic",
      label: LABELS.headingItalic,
      type: "text",
      maxLength: 80,
      fallback: copy.headingItalic ?? "",
    },
    {
      id: "note",
      label: LABELS.note,
      type: "longText",
      maxLength: 240,
      fallback: copy.note ?? "",
    },
  ];
}
