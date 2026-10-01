import type {
  FontPair,
  ModularDesign,
  ModularPalette,
  ModularTemplate,
  SectionDefinition,
  SectionModule,
} from "@/types/modular";

/*
 * Everything modular is found by id, the way `loadTemplate` finds a
 * template: a new section is a new folder, a new palette or pair a new file,
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

/** A template's palette, pair and sections; null when any id names nothing. */
export async function loadDesign(
  template: ModularTemplate,
): Promise<ModularDesign | null> {
  const [palette, fontPair, definitions] = await Promise.all([
    loadPalette(template.palette),
    loadFontPair(template.fontPair),
    Promise.all(template.sections.map((choice) => loadSection(choice.section))),
  ]);
  if (!palette || !fontPair) return null;

  const sections: ModularDesign["sections"] = [];
  for (const [index, definition] of definitions.entries()) {
    if (!definition) return null;
    sections.push({ definition, variant: template.sections[index].variant });
  }
  return { palette, fontPair, sections };
}
