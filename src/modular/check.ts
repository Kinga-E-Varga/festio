import { isCornersId } from "@/modular/corners";
import type {
  FieldSample,
  ItemField,
  ModularTemplate,
  SectionDefinition,
  SectionField,
} from "@/types/modular";

/** What the check reads from the library: ids, and each section's variants and fields. */
interface CheckedLibrary {
  palettes: { id: string }[];
  fontPairs: { id: string }[];
  patterns: { id: string }[];
  sections: SectionDefinition[];
}

/**
 * What in a modular template no longer matches the library, one line each:
 * a palette, font pair, pattern or corners step, a section or variant that
 * is gone, a section listed twice, a `values` key that is no section or no
 * field (down to list and group items), and a value the template never
 * uses: a field its section's style doesn't show, or a section that isn't
 * on (and that no section on reads, as Helpful notes reads Dress code).
 * Empty when it all matches.
 */
export function templateProblems(
  template: ModularTemplate,
  library: CheckedLibrary,
): string[] {
  return [
    ...lookProblems(template, library),
    ...sectionProblems(template, library.sections),
    ...valueProblems(template, library.sections),
    ...unusedProblems(template, library.sections),
  ];
}

function lookProblems(
  template: ModularTemplate,
  library: CheckedLibrary,
): string[] {
  const has = (items: { id: string }[], id: string) =>
    items.some((item) => item.id === id);
  const problems: string[] = [];
  if (!has(library.palettes, template.palette))
    problems.push(`palette "${template.palette}" not found`);
  if (!has(library.fontPairs, template.fontPair))
    problems.push(`font pair "${template.fontPair}" not found`);
  if (
    template.pattern !== undefined &&
    !has(library.patterns, template.pattern)
  )
    problems.push(`pattern "${template.pattern}" not found`);
  if (template.corners !== undefined && !isCornersId(template.corners))
    problems.push(`corners "${template.corners}" not found`);
  return problems;
}

function sectionProblems(
  template: ModularTemplate,
  sections: SectionDefinition[],
): string[] {
  const seen = new Set<string>();
  return template.sections.flatMap(({ section, variant }) => {
    if (seen.has(section)) return [`section "${section}" listed twice`];
    seen.add(section);
    const definition = sections.find(({ id }) => id === section);
    if (!definition) return [`section "${section}" not found`];
    return definition.variants.some(({ id }) => id === variant)
      ? []
      : [`section "${section}": variant "${variant}" not found`];
  });
}

function valueProblems(
  template: ModularTemplate,
  sections: SectionDefinition[],
): string[] {
  return Object.entries(template.values ?? {}).flatMap(([section, samples]) => {
    const definition = sections.find(({ id }) => id === section);
    if (!definition) return [`values: section "${section}" not found`];
    return Object.entries(samples).flatMap(([id, sample]) => {
      const field = definition.fields.find((field) => field.id === id);
      const missing = field ? fieldMisses(field, sample) : [id];
      return missing.map(
        (path) => `values "${section}": field "${path}" not found`,
      );
    });
  });
}

/** A list's or groups field's sample keys its items don't have, as `shows` paths. */
function fieldMisses(field: SectionField, sample: FieldSample): string[] {
  return itemKeys(field, sample)
    .filter(({ key, fields }) => !fields.some(({ id }) => id === key))
    .map(({ path }) => path);
}

/**
 * Every key a list's or groups field's sample sets on its items (a group's
 * own values, and its items'), with its `shows` path and the item fields
 * it should be one of.
 */
function itemKeys(field: SectionField, sample: FieldSample) {
  if (!Array.isArray(sample)) return [];
  const keys = (item: unknown, fields: ItemField[], path: string) =>
    Object.keys(item as Record<string, unknown>).map((key) => ({
      key,
      fields,
      path: `${path}.${key}`,
    }));
  if (field.type === "list")
    return sample.flatMap((item) => keys(item, field.item, field.id));
  if (field.type === "groups")
    return sample.flatMap((group) => {
      const { values, items } = group as {
        values: Record<string, unknown>;
        items: Record<string, unknown>[];
      };
      return [
        ...keys(values, field.group, field.id),
        ...items.flatMap((item) =>
          keys(item, field.items.item, `${field.id}.items`),
        ),
      ];
    });
  return [];
}

/**
 * Values the template never uses: what isn't shown can't be seen, so it is
 * left to `DEFAULTS`. Sections another one reads are checked by their reader,
 * not here. Keys that are no field are `valueProblems`'.
 */
function unusedProblems(
  template: ModularTemplate,
  sections: SectionDefinition[],
): string[] {
  // A section listed twice is `sectionProblems`'; its first entry counts.
  const on = new Map<string, string>();
  for (const { section, variant } of template.sections)
    if (!on.has(section)) on.set(section, variant);
  const read = new Set(
    sections
      .filter(({ id }) => on.has(id))
      .flatMap((definition) => definition.reads ?? []),
  );
  return Object.entries(template.values ?? {}).flatMap(([section, samples]) => {
    const definition = sections.find(({ id }) => id === section);
    if (!definition || read.has(section)) return [];
    const variant = on.get(section);
    if (variant === undefined)
      return [`values: section "${section}" is not on`];
    const info = definition.variants.find(({ id }) => id === variant);
    if (!info) return [];
    const shows = info.shows.map((path) => path.replace(/\.first$/, ""));
    const shown = (path: string) =>
      shows.some((id) => id === path || id.startsWith(`${path}.`));
    return Object.entries(samples).flatMap(([id, sample]) => {
      const field = definition.fields.find((field) => field.id === id);
      if (!field) return [];
      const missing = new Set(fieldMisses(field, sample));
      const paths = shown(id)
        ? samplePaths(field, sample).filter(
            (path) => !shown(path) && !missing.has(path),
          )
        : [id];
      return paths.map(
        (path) =>
          `values "${section}": field "${path}" not shown by variant "${variant}"`,
      );
    });
  });
}

/** Every item key a list's or groups field's sample sets, as `shows` paths, each once. */
function samplePaths(field: SectionField, sample: FieldSample): string[] {
  return [...new Set(itemKeys(field, sample).map(({ path }) => path))];
}
