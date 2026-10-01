"use client";

import { use } from "react";
import { loadVariant } from "@/modular/variants";
import type { VariantModule, VariantProps } from "@/types/modular";

/*
 * One promise per variant, kept so `use` gets the same one every render —
 * a fresh import would suspend forever. A missing file resolves to null.
 */
const loads = new Map<string, Promise<VariantModule | null>>();

function variantFor(section: string, variant: string) {
  const key = `${section}/${variant}`;
  const existing = loads.get(key);
  if (existing) return existing;

  const load = loadVariant(section, variant).catch(() => null);
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
}: VariantProps & { section: string; variant: string }) {
  const loaded = use(variantFor(section, variant));
  if (!loaded) return null;
  return <loaded.Variant {...props} />;
}
