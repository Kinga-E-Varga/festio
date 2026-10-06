"use client";

import { use } from "react";
import { loadVariant } from "@/modular/variants";
import type {
  SectionDefinition,
  VariantModule,
  VariantProps,
} from "@/types/modular";

/*
 * One promise per variant, kept so `use` gets the same one every render —
 * a fresh import would suspend forever. A variant not listed, or with no
 * file, resolves to null.
 */
const loads = new Map<string, Promise<VariantModule | null>>();

function variantFor(section: SectionDefinition, variant: string) {
  const listed = section.variants.some(({ id }) => id === variant);
  const key = `${section.id}/${variant}`;
  const existing = loads.get(key);
  if (existing) return existing;

  const load = listed
    ? loadVariant(section.id, variant).catch(() => null)
    : Promise.resolve(null);
  loads.set(key, load);
  return load;
}

/**
 * A section's variant, resolved in the browser so phase 2 can re-render it
 * live as the host types. An id with no file draws nothing rather than
 * taking the page down with it.
 */
export function SectionView({
  section,
  variant,
  ...props
}: VariantProps & { section: SectionDefinition; variant: string }) {
  const loaded = use(variantFor(section, variant));
  if (!loaded) return null;
  return <loaded.Variant {...props} />;
}
