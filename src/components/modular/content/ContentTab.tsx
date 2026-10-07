"use client";

import { useLocale, useTranslations } from "next-intl";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import { SUBBOX } from "@/components/dashboard/event-editor/styles";
import { pad } from "@/lib/event";
import { localized, type Language } from "@/lib/language";
import type {
  InvitationBasics,
  ModularLibrary,
  ModularState,
} from "@/types/modular";
import { RollArrow } from "../design/RollOut";
import { SectionBar } from "../design/SectionBar";
import { BOX_MARK, SECTION_CARD, SECTION_REVEAL } from "../design/styles";
import { PaletteColors } from "./palette";
import { hasContent } from "@/modular/fields";
import { sectionsOn } from "@/modular/state";
import { SectionFields } from "./SectionFields";

/** A section's card in the Content tab, for the preview's Content button to scroll to. */
export function contentCardId(section: string) {
  return `content-card-${section}`;
}

interface ContentTabProps {
  library: ModularLibrary;
  state: ModularState;
  basics: InvitationBasics;
  /** The invitation's language: what a date format is previewed in. */
  language: Language;
  /** The one section whose fields are out; null for none. */
  openSection: string | null;
  onOpen: (id: string | null) => void;
  /** Save was tried with an empty required field: show every such error. */
  showErrors: boolean;
  onChange: (next: ModularState) => void;
}

/**
 * Every section that is on and has something to edit, in page order,
 * numbered as the page shows them:
 * Design's card with the number laid out like the Design boxes' icons
 * (01, 02…, the same gap to the name). A card opens its section's
 * fields under it; opening one closes the one that was open.
 */
export function ContentTab({
  library,
  state,
  basics,
  language,
  openSection,
  onOpen,
  showErrors,
  onChange,
}: ContentTabProps) {
  const t = useTranslations("ContentTab");
  const host = useLocale() as Language;
  const shown = sectionsOn(state, library);
  const palette = library.palettes.find(({ id }) => id === state.palette);

  return (
    <PaletteColors value={palette?.colors ?? null}>
      <div
        role="group"
        aria-labelledby="content-heading-sections"
        className="mb-8 flex flex-col"
      >
        <EditorHeading
          id="content-heading-sections"
          title={t("sections")}
          className="mb-[18px]"
        />
        <div className="flex flex-col gap-5">
          {shown.map(({ definition, variant }, index) => {
            /* Numbered by its place on the page, even past one left out. */
            if (!hasContent(definition)) return null;
            const name = localized(definition.name, host);
            const open = openSection === definition.id;
            const panelId = `content-fields-${definition.id}`;
            return (
              <div
                key={definition.id}
                id={contentCardId(definition.id)}
                className="flex flex-col"
              >
                <div className={`${SECTION_CARD} group relative`}>
                  <button
                    type="button"
                    data-reveal
                    aria-label={t("open", { section: name })}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => onOpen(open ? null : definition.id)}
                    className={SECTION_REVEAL}
                  />
                  <SectionBar
                    mark={
                      <span
                        aria-hidden="true"
                        className={`${BOX_MARK} flex items-center font-serif text-[20px] leading-none tabular-nums`}
                      >
                        {pad(index + 1)}
                      </span>
                    }
                    name={name}
                    arrow={
                      <RollArrow
                        open={open}
                        action={t("edit")}
                        reveal="group-has-[[data-reveal]:focus-visible]:opacity-100"
                      />
                    }
                  />
                </div>
                {open ? (
                  <div
                    id={panelId}
                    className={`${SUBBOX} flex flex-col gap-4 border-t-0 bg-neutral-50`}
                  >
                    <SectionFields
                      library={library}
                      definition={definition}
                      variant={variant}
                      state={state}
                      basics={basics}
                      language={language}
                      showErrors={showErrors}
                      onChange={onChange}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </PaletteColors>
  );
}
