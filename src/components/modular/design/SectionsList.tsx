"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import { PanelSwitch } from "@/components/invitation/PanelSwitch";
import { localized, type Language } from "@/lib/language";
import { NOTE_KINDS, type NoteKind } from "@/modular/notes";
import { customNoteSample } from "@/modular/samples";
import {
  NOTES_ID,
  noteSwitchOn,
  setNoteSwitch,
  setSectionOn,
  setVariant,
  showNotes,
} from "@/modular/state";
import type {
  ModularLibrary,
  ModularState,
  SectionDefinition,
  SectionState,
} from "@/types/modular";
import { RollArrow } from "./RollOut";
import { VariantBands } from "./VariantBands";

/**
 * A section's bar, the event editor's summary row: a pale card with a gold
 * edge, the toggle where that row has an icon — a required section has
 * none, its name at the left — and the styles arrow on the right. On,
 * the whole bar brings the section into view and rolls its styles out
 * under it, sharing the edge; while they are out, it only rolls them back.
 * Hovered, it says "Change" or "Close" by the arrow, like the other Design
 * boxes.
 */
const CARD =
  "flex min-h-[50px] flex-col justify-center border border-mustard-300 py-1 pr-4 pl-5 text-neutral-800 transition-colors";
/**
 * An on section's whole bar: a button laid over the card, under its
 * switches, which sit above it.
 */
const REVEAL =
  "absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mustard-500";
const NAME = "text-[14px] font-medium text-neutral-800";
/**
 * Helpful notes' own switches, inside its card under a divider that runs
 * edge to edge, each toggle first, lined up with the section's name. The
 * styles come after them.
 */
const NOTES =
  "mt-1 -mr-4 -mb-1 -ml-5 flex flex-col border-t border-mustard-300 pt-1.5 pr-4 pl-[68px]";

const NOTE_LABEL = {
  "dress-code": "noteDressCode",
  gifts: "noteGifts",
  custom: "noteCustom",
} as const satisfies Record<NoteKind, string>;

interface SectionsListProps {
  library: ModularLibrary;
  state: ModularState;
  /** The invitation's language: a custom note added here is written in it. */
  language: Language;
  /** `show`: a section to bring into view once the change is drawn. */
  onChange: (next: ModularState, show?: string) => void;
  /** Brings a section into view in the preview. */
  onReveal: (id: string) => void;
}

/**
 * Every section in its fixed order: a switch for the optional ones, the
 * style picker under each one that is on, and Helpful notes' own three
 * switches right under its own.
 */
export function SectionsList({
  library,
  state,
  language,
  onChange,
  onReveal,
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
              onReveal={onReveal}
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
  onReveal,
}: {
  definition: SectionDefinition;
  section: SectionState;
} & Omit<SectionsListProps, "library">) {
  const t = useTranslations("DesignTab");
  const host = useLocale() as Language;
  const name = localized(definition.name, host);
  const switchId = `design-section-${definition.id}`;
  /* An optional section that is off: its card has no fill until hovered. */
  const offable = !definition.required && !section.on;
  const [stylesOpen, setStylesOpen] = useState(false);
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
    <div className="flex flex-col">
      {/*
       * Off, the card drops its fill — only its edge is left, like a slot —
       * and hovered, the fill comes back. Only the switch turns it on.
       */}
      <div
        className={`${CARD} group relative ${offable ? "bg-transparent hover:bg-neutral-50" : "bg-neutral-50"} ${section.on ? "hover:bg-mustard-50" : ""}`}
      >
        {/* Laid first, so the switches are drawn over it. */}
        {section.on ? (
          <button
            type="button"
            data-reveal
            aria-label={t("reveal", { section: name })}
            aria-expanded={stylesOpen}
            aria-controls={stylesId}
            onClick={() => {
              if (!stylesOpen) onReveal(definition.id);
              setStylesOpen(!stylesOpen);
            }}
            className={REVEAL}
          />
        ) : null}
        {definition.required ? (
          <div className="flex min-h-10 items-center justify-between gap-3">
            {title}
            {arrow}
          </div>
        ) : (
          <PanelSwitch
            id={switchId}
            label={name}
            checked={section.on}
            onChange={turn}
            heading={title}
            end={arrow}
          />
        )}
        {section.on && definition.id === NOTES_ID ? (
          <div className={NOTES}>
            {NOTE_KINDS.map((kind) => (
              <PanelSwitch
                key={kind}
                id={`design-note-${kind}`}
                label={t(NOTE_LABEL[kind])}
                heading={<span className={NAME}>{t(NOTE_LABEL[kind])}</span>}
                checked={noteSwitchOn(state, kind)}
                onChange={(on) => {
                  const next = setNoteSwitch(
                    state,
                    kind,
                    on,
                    customNoteSample(definition, language),
                  );
                  onChange(next, NOTES_ID);
                }}
              />
            ))}
          </div>
        ) : null}
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
          onPick={(variant) =>
            onChange(setVariant(state, definition.id, variant), definition.id)
          }
        />
      ) : null}
    </div>
  );
}
