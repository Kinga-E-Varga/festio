"use client";

import { useTranslations } from "next-intl";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import { paletteVars } from "@/modular/vars";
import type { ModularPalette, ModularTemplate } from "@/types/modular";
import { OPTION_CARD, RollOut } from "./RollOut";

interface TemplatePickerProps {
  templates: ModularTemplate[];
  /** To draw each template's card in its own colours. */
  palettes: ModularPalette[];
  current: string;
  onPick: (id: string) => void;
}

/**
 * The template the design started from: the box with its name, and its
 * cards each a tiny invitation in that template's palette, named — templates
 * can share a palette, so the colours alone would not tell them apart.
 */
export function TemplatePicker({
  templates,
  palettes,
  current,
  onPick,
}: TemplatePickerProps) {
  const t = useTranslations("DesignTab");
  const name = templates.find(({ id }) => id === current)?.name ?? "";

  return (
    <div
      role="group"
      aria-labelledby="design-heading-template"
      className="mb-8 flex flex-col"
    >
      <EditorHeading
        id="design-heading-template"
        title={t("template")}
        className="mb-[18px]"
      />
      <RollOut
        id="design-templates"
        label={`${t("template")}: ${name}`}
        icon="templates"
        summary={<span className="min-w-0">{name}</span>}
      >
        {templates.map((template) => {
          const palette = palettes.find(({ id }) => id === template.palette);
          return (
            <button
              key={template.id}
              type="button"
              aria-pressed={template.id === current}
              onClick={() => onPick(template.id)}
              style={palette ? paletteVars(palette) : undefined}
              className={`${OPTION_CARD} h-[60px] flex-col justify-between border border-[var(--m-line)] bg-[var(--m-surface)] p-2.5 text-left`}
            >
              <span aria-hidden="true" className="flex gap-1">
                <span className="size-2.5 rounded-full bg-[var(--m-accent)]" />
                <span className="size-2.5 rounded-full bg-[var(--m-secondary)]" />
                <span className="size-2.5 rounded-full bg-[var(--m-tertiary)]" />
              </span>
              <span className="truncate text-[12.5px] font-medium text-[color:var(--m-ink)]">
                {template.name}
              </span>
            </button>
          );
        })}
      </RollOut>
    </div>
  );
}
