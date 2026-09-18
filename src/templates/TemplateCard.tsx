"use client";

import { use } from "react";
import type { TemplateModule, TemplateValues } from "@/types/invitation";

/*
 * One promise per template, kept so `use` is handed the same one on every
 * render — a fresh import would suspend forever.
 */
const loads = new Map<string, Promise<TemplateModule>>();

function moduleFor(id: string): Promise<TemplateModule> {
  const existing = loads.get(id);
  if (existing) return existing;

  const load = import(`./${id}`) as Promise<TemplateModule>;
  loads.set(id, load);
  return load;
}

/**
 * A template's card, resolved in the browser. The host editor re-renders it
 * on every keystroke, so it has to be in the client bundle; the guest page
 * renders the very same component on the server instead.
 */
export function TemplateCard({
  id,
  values,
}: {
  id: string;
  values: TemplateValues;
}) {
  const loaded = use(moduleFor(id));
  return <loaded.Card values={values} />;
}
