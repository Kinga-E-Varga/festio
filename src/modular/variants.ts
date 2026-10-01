import type { VariantModule } from "@/types/modular";

/**
 * A variant's file: `sections/<section>/<variant>.tsx`. Kept out of
 * `./index`, which the server page imports: an import context there would
 * pull every variant into the server graph, and some use client hooks.
 * Only `SectionView` calls this.
 */
export function loadVariant(
  section: string,
  variant: string,
): Promise<VariantModule> {
  return import(`./sections/${section}/${variant}`) as Promise<VariantModule>;
}
