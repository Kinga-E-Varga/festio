"use client";

import { memo, use } from "react";
import { shownHeading } from "@/modular/heading";
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
type SectionViewProps = VariantProps & {
  section: SectionDefinition;
  variant: string;
};

/*
 * Redrawn only when something it draws changed. `related` is built afresh
 * on every render, so it is compared by the values it holds.
 */
function sameProps(a: SectionViewProps, b: SectionViewProps): boolean {
  const keys = Object.keys(a) as (keyof SectionViewProps)[];
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => {
    if (key !== "related") return a[key] === b[key];
    const left = a.related ?? {};
    const right = b.related ?? {};
    const ids = Object.keys(left);
    return (
      ids.length === Object.keys(right).length &&
      ids.every((id) => left[id] === right[id])
    );
  });
}

export const SectionView = memo(function SectionView({
  section,
  variant,
  values,
  ...props
}: SectionViewProps) {
  const loaded = use(variantFor(section, variant));
  const info = section.variants.find(({ id }) => id === variant);
  if (!loaded || !info) return null;
  return (
    <loaded.Variant values={shownHeading(values, info.shows)} {...props} />
  );
}, sameProps);
