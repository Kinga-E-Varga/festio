import type { SimpleTemplateModule, TemplateModule } from "@/types/invitation";

/**
 * Templates are found by folder name: `src/templates/<id>/index`. Adding a
 * template is adding that one folder — nothing in here changes, and nothing
 * registers it.
 */
export async function loadTemplate(id: string): Promise<TemplateModule | null> {
  try {
    return (await import(`./${id}`)) as TemplateModule;
  } catch {
    return null;
  }
}

/**
 * A simple template, or null. For the pages that only know how to draw a
 * card — the guest page, the print page and the host's invitation page — a
 * modular template reads as not found until they learn sections.
 */
export async function loadSimpleTemplate(
  id: string,
): Promise<SimpleTemplateModule | null> {
  const loaded = await loadTemplate(id);
  return loaded?.template.kind === "simple"
    ? (loaded as SimpleTemplateModule)
    : null;
}
