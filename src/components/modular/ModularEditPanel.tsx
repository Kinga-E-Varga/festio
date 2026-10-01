"use client";

import { useState } from "react";
import {
  PanelTabs,
  TABPANEL_ID,
  tabElementId,
  type PanelTabId,
} from "@/components/invitation/PanelTabs";
import { PanelViewButton, SidePanel } from "@/components/invitation/SidePanel";

/**
 * The simple editor's shell and tabs, with every tab empty: phase 2 builds
 * the forms from the section definitions.
 */
export function ModularEditPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<PanelTabId>("text");

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
        <PanelViewButton onClose={onClose} />
      </div>
    </SidePanel>
  );
}
