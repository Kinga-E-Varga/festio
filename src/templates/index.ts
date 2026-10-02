import type { SimpleTemplateModule, TemplateModule } from "@/types/invitation";

/**
 * Templates are found by folder name: `src/templates/simple/<id>/index` or
 * `src/templates/modular/<id>/index`. Adding a template is adding that one
 * folder — nothing in here changes, and nothing registers it. An id is
 * unique across both folders.
 */
export async function loadTemplate(id: string): Promise<TemplateModule | null> {
  return (await loadSimpleTemplate(id)) ?? (await loadModularTemplate(id));
}

/**
 * A simple template, or null. For the pages that only know how to draw a
 * card — the guest page, the print page and the host's invitation page — a
 * modular template reads as not found until they learn sections.
 */
export async function loadSimpleTemplate(
  id: string,
): Promise<SimpleTemplateModule | null> {
  try {
    return (await import(`./simple/${id}`)) as SimpleTemplateModule;
  } catch {
    return null;
  }
}

async function loadModularTemplate(id: string): Promise<TemplateModule | null> {
  try {
    return (await import(`./modular/${id}`)) as TemplateModule;
  } catch {
    return null;
  }
}
