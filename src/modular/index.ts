import type {
  FontPair,
  ModularDesign,
  ModularPalette,
  ModularPattern,
  ModularTemplate,
  SectionDefinition,
  SectionModule,
} from "@/types/modular";

/*
 * Everything modular is found by id, the way `loadTemplate` finds a
 * template: a new section is a new folder, a new palette, pair or pattern a
 * new file,
 * and nothing registers it. Variants load in the browser — `./variants`.
 */

export async function loadSection(
  id: string,
): Promise<SectionDefinition | null> {
  try {
    return ((await import(`./sections/${id}/index`)) as SectionModule).section;
  } catch {
    return null;
  }
}

export async function loadPalette(id: string): Promise<ModularPalette | null> {
  try {
    return ((await import(`./palettes/${id}`)) as { palette: ModularPalette })
      .palette;
  } catch {
    return null;
  }
}

export async function loadFontPair(id: string): Promise<FontPair | null> {
  try {
    return ((await import(`./font-pairs/${id}`)) as { fontPair: FontPair })
      .fontPair;
  } catch {
    return null;
  }
}

export async function loadPattern(id: string): Promise<ModularPattern | null> {
  try {
    return ((await import(`./patterns/${id}`)) as { pattern: ModularPattern })
      .pattern;
  } catch {
    return null;
  }
}

/**
 * A template's palette, pair, pattern, sections and the sections they
 * read; null when any id names nothing. Sections come in each one's own
 * `order`, whatever order the template lists them in.
 */
export async function loadDesign(
  template: ModularTemplate,
): Promise<ModularDesign | null> {
  const [palette, fontPair, pattern, definitions] = await Promise.all([
    loadPalette(template.palette),
    loadFontPair(template.fontPair),
    template.pattern ? loadPattern(template.pattern) : null,
    Promise.all(template.sections.map((choice) => loadSection(choice.section))),
  ]);
  if (!palette || !fontPair) return null;
  if (template.pattern && !pattern) return null;

  const sections: ModularDesign["sections"] = [];
  for (const [index, definition] of definitions.entries()) {
    if (!definition) return null;
    sections.push({ definition, variant: template.sections[index].variant });
  }
  sections.sort((a, b) => a.definition.order - b.definition.order);

  /* A read that names nothing is a typo in a section file: fail as loudly as a missing section. */
  const readIds = [
    ...new Set(sections.flatMap(({ definition }) => definition.reads ?? [])),
  ];
  const reads = await Promise.all(readIds.map(loadSection));
  const related: ModularDesign["related"] = {};
  for (const [index, definition] of reads.entries()) {
    if (!definition) return null;
    related[readIds[index]] = definition;
  }

  return { palette, fontPair, pattern, sections, related };
}
