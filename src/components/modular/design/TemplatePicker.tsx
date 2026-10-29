"use client";

import { useTranslations } from "next-intl";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import { fontClasses, fontVars, paletteVars } from "@/modular/vars";
import type {
  FontPair,
  ModularPalette,
  ModularTemplate,
} from "@/types/modular";
import { SWATCHES } from "./LookPickers";
import { OPTION_CARD, OptionTip, RollOut } from "./RollOut";

interface TemplatePickerProps {
  templates: ModularTemplate[];
  /** To draw each template's card in its own colours. */
  palettes: ModularPalette[];
  /** To write each template's name in its own heading face. */
  fontPairs: FontPair[];
  current: string;
  onPick: (id: string) => void;
}

/**
 * The template the design started from: the box with its name, and its
 * cards each the template's name in its own heading face on its page colour
 * and its colours as a strip along the foot
 * (not the page's: it would blend into the card). Each card is 112px wide.
 */
export function TemplatePicker({
  templates,
  palettes,
  fontPairs,
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
      <EditorHeading id="design-heading-template" title={t("template")} />
      <RollOut
        id="design-templates"
        label={`${t("template")}: ${name}`}
        icon="templates"
        // The frame is mostly outline, so the app's own 1.5 already matches the others.
        iconStroke={1.5}
        summary={<span className="min-w-0">{name}</span>}
      >
        {templates.map((template) => {
          const palette = palettes.find(({ id }) => id === template.palette);
          const pair = fontPairs.find(({ id }) => id === template.fontPair);
          return (
            <OptionTip key={template.id} tip={template.name}>
              <button
                type="button"
                aria-pressed={template.id === current}
                onClick={() => onPick(template.id)}
                style={{
                  ...(palette ? paletteVars(palette) : {}),
                  ...(pair ? fontVars(pair) : {}),
                }}
                className={`${OPTION_CARD} w-[112px] flex-col overflow-hidden border border-neutral-400 bg-[var(--m-surface)] ${pair ? fontClasses(pair) : ""}`}
              >
                <span className="flex flex-1 items-center justify-center px-1.5">
                  <span
                    className={`max-w-full truncate font-[family-name:var(--font-secondary)] text-[13.5px] font-semibold leading-tight text-[color:var(--m-ink)]`}
                  >
                    {template.name}
                  </span>
                </span>
                <span aria-hidden="true" className="flex h-3 shrink-0">
                  {SWATCHES.filter(([role]) => role !== "surface").map(
                    ([role, fill]) => (
                      <span key={role} className={`flex-1 ${fill}`} />
                    ),
                  )}
                </span>
              </button>
            </OptionTip>
          );
        })}
      </RollOut>
    </div>
  );
}
