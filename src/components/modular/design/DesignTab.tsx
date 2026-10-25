"use client";

import { useTranslations } from "next-intl";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import { Switch } from "@/components/invitation/PanelSwitch";
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
import { SectionBar } from "./SectionBar";
import { SECTION_CARD as CARD } from "./styles";
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
  /** The Design tab's one section with its styles out. */
  openStyles: string | null;
  onOpenStyles: (id: string | null) => void;
  /** One of a section's styles picked. */
  onStylePicked: () => void;
}

/**
 * The Design tab, top to bottom: template, palette, pattern, fonts,
 * corners, envelope and sections.
 */
export function DesignTab({
  library,
  state,
  templateId,
  language,
  onChange,
  onTemplate,
  openStyles,
  onOpenStyles,
  onStylePicked,
}: DesignTabProps) {
  const t = useTranslations("DesignTab");
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
      <div
        role="group"
        aria-labelledby="design-heading-envelope"
        className="mb-8 flex flex-col"
      >
        <EditorHeading
          id="design-heading-envelope"
          title={t("envelopeHeading")}
        />
        {/* As a section's card in Sections, its switch set the same way. */}
        <div className={CARD}>
          <SectionBar
            mark={
              <Switch
                size="panel"
                tone="light"
                id="envelope-switch"
                label={t("envelope")}
                checked={state.envelope}
                onChange={(on) => onChange({ ...state, envelope: on })}
              />
            }
            name={t("envelope")}
          />
        </div>
      </div>
      <SectionsList
        library={library}
        state={state}
        language={language}
        onChange={onChange}
        openStyles={openStyles}
        onOpenStyles={onOpenStyles}
        onStylePicked={onStylePicked}
      />
    </div>
  );
}
