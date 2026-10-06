"use client";

import type { Language } from "@/lib/language";
import { DEFAULT_CORNERS, isCornersId } from "@/modular/corners";
import type { ModularLibrary, ModularState } from "@/types/modular";
import {
  CornersPicker,
  FontPairPicker,
  PalettePicker,
  PatternPicker,
} from "./LookPickers";
import { SectionsList } from "./SectionsList";
import { TemplatePicker } from "./TemplatePicker";

interface DesignTabProps {
  library: ModularLibrary;
  state: ModularState;
  /** The template shown as current. Never stored. */
  templateId: string;
  /** The invitation's language. */
  language: Language;
  /** `show`: a section to bring into view once the change is drawn. */
  onChange: (next: ModularState, show?: string) => void;
  onTemplate: (id: string) => void;
  /** Brings a section into view in the preview. */
  onReveal: (id: string) => void;
}

/**
 * The Design tab, top to bottom: template, palette, pattern, fonts,
 * corners and sections.
 */
export function DesignTab({
  library,
  state,
  templateId,
  language,
  onChange,
  onTemplate,
  onReveal,
}: DesignTabProps) {
  return (
    <div className="flex flex-col">
      <TemplatePicker
        templates={library.templates}
        palettes={library.palettes}
        current={templateId}
        onPick={onTemplate}
      />
      <PalettePicker
        palettes={library.palettes}
        current={state.palette}
        onPick={(id) => onChange({ ...state, palette: id })}
      />
      <PatternPicker
        patterns={library.patterns}
        current={state.pattern}
        onPick={(id) => onChange({ ...state, pattern: id })}
      />
      <FontPairPicker
        fontPairs={library.fontPairs}
        current={state.fontPair}
        onPick={(id) => onChange({ ...state, fontPair: id })}
      />
      <CornersPicker
        current={isCornersId(state.corners) ? state.corners : DEFAULT_CORNERS}
        onPick={(id) => onChange({ ...state, corners: id })}
      />
      <SectionsList
        library={library}
        state={state}
        language={language}
        onChange={onChange}
        onReveal={onReveal}
      />
    </div>
  );
}
