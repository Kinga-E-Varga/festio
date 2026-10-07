import { localized, type Language, type LocalizedText } from "@/lib/language";
import { DEFAULTS } from "@/modular/defaults";
import type {
  FieldSample,
  GroupSample,
  ListItem,
  SectionDefinition,
  SectionField,
  SectionSamples,
  SectionValues,
} from "@/types/modular";

// Sample content, for the editor only: `DEFAULTS` is large, so it stays out
// of the guest page's bundle (the variants import content.ts, not this).

function localizeItem(
  item: Record<string, LocalizedText>,
  language: Language,
): ListItem {
  return Object.fromEntries(
    Object.entries(item).map(([id, copy]) => [id, localized(copy, language)]),
  );
}

/**
 * One field's sample in one language, read as its type wants it. A sample
 * that is missing or of the wrong shape reads as empty.
 */
function readSample(
  field: SectionField,
  sample: FieldSample | undefined,
  language: Language,
): SectionValues[string] {
  switch (field.type) {
    case "toggle":
      return sample === true;
    case "list":
      return Array.isArray(sample)
        ? (sample as Record<string, LocalizedText>[]).map((item) =>
            localizeItem(item, language),
          )
        : [];
    case "groups":
      return Array.isArray(sample)
        ? (sample as GroupSample[]).map((group) => ({
            values: localizeItem(group.values, language),
            items: group.items.map((item) => localizeItem(item, language)),
          }))
        : [];
    default:
      return sample === undefined ||
        typeof sample === "boolean" ||
        Array.isArray(sample)
        ? ""
        : localized(sample, language);
  }
}

/**
 * A section's sample content in one language. There is no event yet, so
 * every field is the template's sample when it gives one, else `DEFAULTS`;
 * later the host's values lie over it.
 */
export function sectionValues(
  definition: SectionDefinition,
  language: Language,
  own?: SectionSamples,
): SectionValues {
  const defaults = DEFAULTS[definition.id];
  return Object.fromEntries(
    definition.fields
      // The event's date is the event's, never a section value.
      .filter((field) => field.type !== "eventDate")
      .map((field) => [
        field.id,
        readSample(field, own?.[field.id] ?? defaults?.[field.id], language),
      ]),
  );
}

/**
 * The note the Design tab adds when Custom is turned on with none left: the
 * section's sample custom note in `DEFAULTS`, so the preview shows a card,
 * not a gap.
 */
export function customNoteSample(
  definition: SectionDefinition,
  language: Language,
): ListItem | null {
  const items = DEFAULTS[definition.id]?.items;
  if (!Array.isArray(items)) return null;
  const sample = (items as Record<string, LocalizedText>[]).find(
    (item) => item.kind === "custom",
  );
  if (!sample) return null;
  return Object.fromEntries(
    Object.entries(sample).map(([id, copy]) => [id, localized(copy, language)]),
  );
}
