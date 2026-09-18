import type { TemplateModule } from "@/types/invitation";

/**
 * Templates are found by file name: `src/templates/<id>.tsx`. Adding a
 * template is adding that one file — nothing in here changes, and nothing
 * registers it.
 */
export async function loadTemplate(id: string): Promise<TemplateModule | null> {
  try {
    return (await import(`./${id}`)) as TemplateModule;
  } catch {
    return null;
  }
}
