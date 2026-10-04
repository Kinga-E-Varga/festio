"use client";

import { useState } from "react";
import {
  PanelTabs,
  TABPANEL_ID,
  tabElementId,
  type PanelTabId,
} from "@/components/invitation/PanelTabs";
import { PanelViewButton, SidePanel } from "@/components/invitation/SidePanel";
import type { Language } from "@/lib/language";
import type { ModularLibrary, ModularState } from "@/types/modular";
import { DesignTab } from "./design/DesignTab";

interface ModularEditPanelProps {
  open: boolean;
  onClose: () => void;
  library: ModularLibrary;
  state: ModularState;
  /** The template the Design tab shows as current. */
  templateId: string;
  /** The invitation's language. */
  language: Language;
  onChange: (next: ModularState) => void;
  onTemplate: (id: string) => void;
  /** Brings a section into view in the preview. */
  onReveal: (id: string) => void;
}

/**
 * The simple editor's shell and tabs. Text and Replies are still empty;
 * Design edits the state.
 */
export function ModularEditPanel({
  open,
  onClose,
  ...design
}: ModularEditPanelProps) {
  const [tab, setTab] = useState<PanelTabId>("design");

  return (
    <SidePanel
      panelClassName="edit"
      open={open}
      inert={!open}
      tabs={<PanelTabs tab={tab} onSelect={setTab} />}
      onClose={onClose}
    >
      <div
        role="tabpanel"
        id={TABPANEL_ID}
        aria-labelledby={tabElementId(tab)}
        className="mx-auto flex w-full max-w-[640px] flex-col"
      >
        {tab === "design" ? <DesignTab {...design} /> : null}
        <PanelViewButton onClose={onClose} />
      </div>
    </SidePanel>
  );
}
