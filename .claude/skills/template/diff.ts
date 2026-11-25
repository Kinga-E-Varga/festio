/*
 * The `template` skill's helper: what a draft changes, field by field.
 *   node .claude/skills/template/run.mjs drafts/templates/<id>.json
 * For every section the draft has on (and those it reads), each field's
 * value is compared, in the draft's language, with the starting template's
 * sample and with `DEFAULTS`:
 *   default   — the same as DEFAULTS: leave it out of `values`
 *   template  — the same as the starting template's own sample: keep that
 *               sample as it is (its other languages are already written)
 *   changed   — new: write it, with the other two languages for a phrase
 *   unsampled — empty because the variant never fills it: leave it out
 */
import { readFileSync } from "node:fs";
import { sectionValues } from "@/modular/samples";
import type { TemplateDraft } from "@/lib/template-draft";
import type {
  ModularTemplateModule,
  SectionDefinition,
  SectionModule,
} from "@/types/modular";

/* Run through Vite (`run.mjs`), so the library's own globs work here too. */
const SECTIONS = import.meta.glob<SectionModule>(
  "/src/modular/sections/*/index.ts",
  { eager: true },
);
const TEMPLATES = import.meta.glob<ModularTemplateModule>(
  "/src/templates/modular/*/index.ts",
  { eager: true },
);

const sections: SectionDefinition[] = Object.values(SECTIONS)
  .map((module) => module.section)
  .sort((a, b) => a.order - b.order);

function loadStart(id: string) {
  return (
    Object.values(TEMPLATES).find(({ template }) => template.id === id)
      ?.template ?? null
  );
}

const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

export function diff(file: string) {
  const draft = JSON.parse(readFileSync(file, "utf8")) as TemplateDraft & {
    id: string;
  };
  const start = loadStart(draft.from);
  const { state, language } = draft;

  const on = state.sections.filter((choice) => choice.on);
  const read = new Set(
    on.flatMap(
      ({ section }) => sections.find(({ id }) => id === section)?.reads ?? [],
    ),
  );
  console.log(
    `Draft "${draft.id}" (${draft.mode} from "${draft.from}"), written in ${language}`,
  );
  console.log(
    `Look: palette ${state.palette}, font pair ${state.fontPair}, pattern ${state.pattern ?? "none"}, corners ${state.corners}`,
  );
  console.log(
    `Sections on: ${on.map(({ section, variant }) => `${section}:${variant}`).join(", ")}`,
  );
  if (read.size) console.log(`Read by them: ${[...read].join(", ")}`);

  for (const definition of sections) {
    const choice = state.sections.find(
      ({ section }) => section === definition.id,
    );
    if (!choice?.on && !read.has(definition.id)) continue;
    const values = state.values[definition.id] ?? {};
    const defaults = sectionValues(definition, language);
    const own = start?.values?.[definition.id];
    const fromStart = sectionValues(definition, language, own);
    const unsampled =
      definition.variants.find(({ id }) => id === choice?.variant)?.unsampled ??
      [];
    console.log(`\n## ${definition.id} (variant ${choice?.variant})`);
    for (const [id, value] of Object.entries(values)) {
      const mark =
        unsampled.includes(id) && value === ""
          ? "unsampled"
          : own?.[id] !== undefined && same(value, fromStart[id])
            ? "template"
            : same(value, defaults[id])
              ? "default"
              : "changed";
      const shown = mark === "changed" ? ` = ${JSON.stringify(value)}` : "";
      console.log(`  ${mark.padEnd(9)} ${id}${shown}`);
    }
  }
}
