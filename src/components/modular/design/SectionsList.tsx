"use client";

import { useLocale, useTranslations } from "next-intl";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import { Icon } from "@/components/icons";
import { PanelSwitch } from "@/components/invitation/PanelSwitch";
import { localized, type Language } from "@/lib/language";
import { customNoteSample } from "@/modular/samples";
import { NOTES_ID, setSectionOn, setVariant, showNotes } from "@/modular/state";
import type {
  ModularLibrary,
  ModularState,
  SectionDefinition,
  SectionState,
} from "@/types/modular";
import { RollArrow } from "./RollOut";
import { SectionBar } from "./SectionBar";
import {
  BOX_MARK,
  BOX_MARK_STROKE,
  SECTION_CARD as CARD,
  SECTION_NAME as NAME,
  SECTION_REVEAL as REVEAL,
} from "./styles";
import { VariantBands } from "./VariantBands";

interface SectionsListProps {
  library: ModularLibrary;
  state: ModularState;
  /** The invitation's language: a custom note added here is written in it. */
  language: Language;
  /** `show`: a section to bring into view once the change is drawn. */
  onChange: (next: ModularState, show?: string) => void;
  /** The Design tab's one section with its styles out. */
  openStyles: string | null;
  onOpenStyles: (id: string | null) => void;
  /** One of a section's styles picked. */
  onStylePicked: () => void;
}

/** A section's card in the Design tab, by its id: what the preview scrolls to. */
export function designCardId(section: string) {
  return `design-card-${section}`;
}

/**
 * Every section in its fixed order: a switch for the optional ones, the
 * style picker under each one that is on. Helpful notes' Dress code,
 * Gifts and custom notes are switched in the Content tab. One section's styles out at a time, as in
 * the Content tab: opening one rolls the open one back.
 */
export function SectionsList({
  library,
  state,
  language,
  onChange,
  openStyles,
  onOpenStyles,
  onStylePicked,
}: SectionsListProps) {
  const t = useTranslations("DesignTab");

  return (
    <div
      role="group"
      aria-labelledby="design-heading-sections"
      className="mb-8 flex flex-col"
    >
      <EditorHeading
        id="design-heading-sections"
        title={t("sections")}
        className="mb-[18px]"
      />
      <div className="flex flex-col gap-5">
        {state.sections.map((section) => {
          const definition = library.sections.find(
            ({ id }) => id === section.section,
          );
          return definition ? (
            <SectionRow
              key={section.section}
              definition={definition}
              section={section}
              state={state}
              language={language}
              onChange={onChange}
              onStylePicked={onStylePicked}
              stylesOpen={openStyles === definition.id}
              onStyles={(open) => onOpenStyles(open ? definition.id : null)}
            />
          ) : null;
        })}
      </div>
    </div>
  );
}

function SectionRow({
  definition,
  section,
  state,
  language,
  onChange,
  onStylePicked,
  stylesOpen,
  onStyles,
}: {
  definition: SectionDefinition;
  section: SectionState;
  stylesOpen: boolean;
  onStyles: (open: boolean) => void;
} & Omit<SectionsListProps, "library" | "openStyles" | "onOpenStyles">) {
  const t = useTranslations("DesignTab");
  const host = useLocale() as Language;
  const name = localized(definition.name, host);
  const switchId = `design-section-${definition.id}`;
  const stylesId = `design-variants-${definition.id}`;

  function turn(on: boolean) {
    onChange(
      on && definition.id === NOTES_ID
        ? showNotes(state, customNoteSample(definition, language))
        : setSectionOn(state, definition.id, on),
      definition.id,
    );
  }
  /*
   * Only a section that is on has styles to pick. Only a picture: the bar
   * under it is the button.
   */
  const arrow = section.on ? (
    <RollArrow
      open={stylesOpen}
      reveal="group-has-[[data-reveal]:focus-visible]:opacity-100"
    />
  ) : null;
  const title = <span className={NAME}>{name}</span>;

  return (
    <div id={designCardId(definition.id)} className="flex flex-col">
      <div className={`${CARD} group relative`}>
        {/* Laid first, so the switches are drawn over it. */}
        {section.on ? (
          <button
            type="button"
            data-reveal
            aria-label={t("reveal", { section: name })}
            aria-expanded={stylesOpen}
            aria-controls={stylesId}
            onClick={() => onStyles(!stylesOpen)}
            className={REVEAL}
          />
        ) : null}
        {definition.required ? (
          <SectionBar
            /*
             * A lock where the switch would be, set like the look pickers'
             * icons above — same place, size and gap — so its name starts
             * where theirs do, and a switch's: always on, nothing to flip.
             */
            mark={
              <span
                role="img"
                aria-label={t("alwaysOn")}
                title={t("alwaysOn")}
                className="flex shrink-0"
              >
                <Icon
                  name="lock"
                  className={`${BOX_MARK} w-[22px]`}
                  strokeWidth={BOX_MARK_STROKE}
                />
              </span>
            }
            name={name}
            arrow={arrow}
          />
        ) : (
          <PanelSwitch
            /*
             * 11px from the card's edge, 11px to the name: even on both
             * sides, and the name still starts where the icon boxes' do
             * (11 + 36 + 11 = 58).
             */
            className="-ml-[9px]"
            gap="gap-[11px]"
            id={switchId}
            label={name}
            checked={section.on}
            onChange={turn}
            heading={title}
            end={arrow}
          />
        )}
      </div>
      {section.on ? (
        <VariantBands
          id={stylesId}
          open={stylesOpen}
          options={definition.variants.map((variant) => ({
            value: variant.id,
            label: localized(variant.name, host),
          }))}
          value={section.variant}
          onPick={(variant) => {
            onChange(setVariant(state, definition.id, variant), definition.id);
            onStylePicked();
          }}
        />
      ) : null}
    </div>
  );
}
