"use client";

import { useLocale, useTranslations } from "next-intl";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import { MultiSelect } from "@/components/dashboard/guest-list/MultiSelect";
import { PanelSwitch } from "@/components/invitation/PanelSwitch";
import { localized, type Language } from "@/lib/language";
import { customNoteSample, NOTE_KINDS, type NoteKind } from "@/modular/notes";
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
import { DESIGN_DROPDOWN } from "./styles";

/**
 * A section's bar, the event editor's summary row: a pale card with a gold
 * edge, its number where that row has an icon, the toggle on the right.
 * Its style dropdown is glued under it, sharing the edge.
 */
const CARD =
  "flex min-h-[50px] flex-col justify-center border border-mustard-300 py-1 pr-4 pl-5 text-neutral-800 transition-colors";
/**
 * View: a pill the toggle's height, with the edge the toggle has when on.
 * Like the toggle, its tap area reaches 44px tall, invisibly.
 */
const VIEW =
  "relative flex h-5 shrink-0 cursor-pointer items-center rounded-full border border-mustard-500 bg-neutral-50 px-2.5 text-[12px] leading-none font-medium text-mustard-600 transition-colors hover:bg-mustard-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mustard-500 after:absolute after:-inset-x-1.5 after:-inset-y-3 after:content-['']";
const NAME = "text-[14px] font-medium text-neutral-800";
/**
 * Helpful notes' own switches, inside its card under a divider that runs
 * edge to edge, lined up with the section's name. The style dropdown
 * comes after them.
 */
/** A subsection's name: the section name's style, as a dotted list in the numbers' gold. */
const NOTE_NAME =
  "flex items-center gap-2.5 text-[14px] font-medium text-neutral-800";
const NOTES =
  "mt-1 -mr-4 -mb-1 -ml-5 flex flex-col border-t border-mustard-300 pt-1.5 pr-4 pl-[58px]";

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
  onChange: (next: ModularState) => void;
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
        {state.sections.map((section, index) => {
          const definition = library.sections.find(
            ({ id }) => id === section.section,
          );
          return definition ? (
            <SectionRow
              key={section.section}
              number={index + 1}
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
  number,
  definition,
  section,
  state,
  language,
  onChange,
  onReveal,
}: {
  /** Its place in the fixed order, from 1. */
  number: number;
  definition: SectionDefinition;
  section: SectionState;
} & Omit<SectionsListProps, "library">) {
  const t = useTranslations("DesignTab");
  const host = useLocale() as Language;
  const name = localized(definition.name, host);
  const switchId = `design-section-${definition.id}`;
  /* An optional section that is off: its card has no fill until hovered. */
  const offable = !definition.required && !section.on;

  function turn(on: boolean) {
    onChange(
      on && definition.id === NOTES_ID
        ? showNotes(state, customNoteSample(definition, language))
        : setSectionOn(state, definition.id, on),
    );
  }
  /* Only a section that is on has anything to go to. */
  const view = section.on ? (
    <button
      type="button"
      aria-label={t("reveal", { section: name })}
      onClick={() => onReveal(definition.id)}
      className={VIEW}
    >
      {t("view")}
    </button>
  ) : null;
  /* The number stands where the event editor's row has its icon. */
  const title = (
    <div className="flex min-w-0 items-center gap-4">
      <span
        aria-hidden="true"
        className="w-[22px] shrink-0 text-center font-serif text-[20px] leading-none text-mustard-500 tabular-nums"
      >
        {number}
      </span>
      <span className={NAME}>{name}</span>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/*
       * Off, the card drops its fill — only its edge is left, like a slot —
       * and hovered, the fill comes back. Only the switch turns it on.
       */}
      <div
        className={`${CARD} ${offable ? "bg-transparent hover:bg-neutral-50" : "bg-neutral-50"}`}
      >
        {definition.required ? (
          <div className="flex min-h-10 items-center justify-between gap-3">
            {title}
            {view}
          </div>
        ) : (
          <PanelSwitch
            id={switchId}
            label={name}
            checked={section.on}
            onChange={turn}
            heading={title}
            before={view}
          />
        )}
        {section.on && definition.id === NOTES_ID ? (
          <div className={NOTES}>
            {NOTE_KINDS.map((kind) => (
              <PanelSwitch
                key={kind}
                id={`design-note-${kind}`}
                label={t(NOTE_LABEL[kind])}
                heading={
                  <span className={NOTE_NAME}>
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-full border border-mustard-500"
                    />
                    {t(NOTE_LABEL[kind])}
                  </span>
                }
                checked={noteSwitchOn(state, kind)}
                onChange={(on) =>
                  onChange(
                    setNoteSwitch(
                      state,
                      kind,
                      on,
                      customNoteSample(definition, language),
                    ),
                  )
                }
              />
            ))}
          </div>
        ) : null}
      </div>
      {section.on ? (
        <MultiSelect
          single
          label={t("variantFor", { section: name })}
          placeholder=""
          options={definition.variants.map((variant) => ({
            value: variant.id,
            label: localized(variant.name, host),
          }))}
          value={[section.variant]}
          onPick={(variant) =>
            onChange(setVariant(state, definition.id, variant))
          }
          skin={DESIGN_DROPDOWN}
        />
      ) : null}
    </div>
  );
}
