"use client";

import { useTranslations } from "next-intl";
import { TAB_LABEL, type PanelTabId } from "@/components/invitation/PanelTabs";
import { SidePanel } from "@/components/invitation/SidePanel";
import type { StoredQuestion } from "@/db/schemas/event";
import type { Language } from "@/lib/language";
import type {
  InvitationBasics,
  ModularLibrary,
  ModularState,
} from "@/types/modular";
import { ContentTab } from "./content/ContentTab";
import { DesignTab } from "./design/DesignTab";
import { RepliesTab } from "./replies/RepliesTab";

interface ModularEditPanelProps {
  open: boolean;
  onClose: () => void;
  /** The open tab — the editor's, so the strip, Save and the preview can switch it. */
  tab: PanelTabId;
  library: ModularLibrary;
  state: ModularState;
  basics: InvitationBasics;
  /** The template the Design tab shows as current. */
  templateId: string;
  /** The invitation's language. */
  language: Language;
  /** The Content tab's one open section. */
  openSection: string | null;
  onOpenSection: (id: string | null) => void;
  /** Save was tried with an empty required field. */
  showErrors: boolean;
  /** `show`: a section to bring into view once the change is drawn. */
  onChange: (next: ModularState, show?: string) => void;
  onTemplate: (id: string) => void;
  /** The Design tab's one section with its styles out. */
  openStyles: string | null;
  onOpenStyles: (id: string | null) => void;
  /** One of a section's styles picked. */
  onStylePicked: () => void;
  /** The host's reply questions, archived ones too. */
  questions: StoredQuestion[];
  onQuestions: (questions: StoredQuestion[]) => void;
}

/**
 * The modular editor's panel, on the tab picked on the strip. Design and Content edit the state;
 * Replies the host's own reply questions.
 */
export function ModularEditPanel({
  open,
  onClose,
  tab,
  library,
  state,
  basics,
  templateId,
  language,
  openSection,
  onOpenSection,
  showErrors,
  onChange,
  onTemplate,
  openStyles,
  onOpenStyles,
  onStylePicked,
  questions,
  onQuestions,
}: ModularEditPanelProps) {
  const t = useTranslations("HostEditor");

  return (
    <SidePanel
      panelClassName="edit"
      open={open}
      inert={!open}
      title={t(TAB_LABEL[tab])}
      onClose={onClose}
    >
      <div className="mx-auto flex w-full max-w-[640px] flex-col">
        {tab === "design" ? (
          <DesignTab
            library={library}
            state={state}
            templateId={templateId}
            language={language}
            onChange={onChange}
            onTemplate={onTemplate}
            openStyles={openStyles}
            onOpenStyles={onOpenStyles}
            onStylePicked={onStylePicked}
          />
        ) : null}
        {tab === "content" ? (
          <ContentTab
            library={library}
            state={state}
            basics={basics}
            language={language}
            openSection={openSection}
            onOpen={onOpenSection}
            showErrors={showErrors}
            onChange={onChange}
          />
        ) : null}
        {tab === "replies" ? (
          <RepliesTab
            questions={questions}
            onChange={onQuestions}
            language={language}
          />
        ) : null}
      </div>
    </SidePanel>
  );
}
