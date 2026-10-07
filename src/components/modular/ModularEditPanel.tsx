"use client";

import {
  PanelTabs,
  TABPANEL_ID,
  tabElementId,
  type PanelTabId,
} from "@/components/invitation/PanelTabs";
import { PanelViewButton, SidePanel } from "@/components/invitation/SidePanel";
import type { Language } from "@/lib/language";
import type {
  InvitationBasics,
  ModularLibrary,
  ModularState,
} from "@/types/modular";
import { ContentTab } from "./content/ContentTab";
import { DesignTab } from "./design/DesignTab";

interface ModularEditPanelProps {
  open: boolean;
  onClose: () => void;
  /** The open tab — the editor's, so Save and the preview can switch it. */
  tab: PanelTabId;
  onTab: (tab: PanelTabId) => void;
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
}

/**
 * The modular editor's shell and tabs. Design and Content edit the state;
 * Replies is still empty.
 */
export function ModularEditPanel({
  open,
  onClose,
  tab,
  onTab,
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
}: ModularEditPanelProps) {
  return (
    <SidePanel
      panelClassName="edit"
      open={open}
      inert={!open}
      tabs={<PanelTabs tab={tab} onSelect={onTab} />}
      onClose={onClose}
    >
      <div
        role="tabpanel"
        id={TABPANEL_ID}
        aria-labelledby={tabElementId(tab)}
        className="mx-auto flex w-full max-w-[640px] flex-col"
      >
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
        <PanelViewButton onClose={onClose} />
      </div>
    </SidePanel>
  );
}
