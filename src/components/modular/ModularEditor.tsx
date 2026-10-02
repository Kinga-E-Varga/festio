"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/components/dashboard/Toast";
import { EditorFrame } from "@/components/invitation/EditorTopBar";
import type { Language } from "@/lib/language";
import type { InvitationBasics, ModularDesign } from "@/types/modular";
import { ModularEditPanel } from "./ModularEditPanel";
import { ModularInvitation } from "./ModularInvitation";

interface ModularEditorProps {
  design: ModularDesign;
  basics: InvitationBasics;
  language: Language;
  title: string;
}

/**
 * The modular template page: the guest page framed on the editors' ground,
 * with the editor's top bar above it and the edit panel beside it. The box
 * marks what is the invitation; everything around it is the editor. Same bar, same panel shell, same toasts as
 * the simple editor. Nothing is editable yet, so nothing is ever unsaved and
 * Save stays off. The page stays scrollable and the RSVP form works; a reply
 * only ever shows the test toast.
 */
export function ModularEditor({
  design,
  basics,
  language,
  title,
}: ModularEditorProps) {
  const t = useTranslations("HostEditor");
  const [editing, setEditing] = useState(true);
  const toast = useToast();

  return (
    <EditorFrame
      title={title}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
      action={{
        kind: "save",
        dirty: false,
        justSaved: false,
        onSave: () => {},
      }}
      toast={toast}
    >
      <div className="relative h-full bg-mustard-50 p-3 md:p-4.5 invite:p-6 rail:p-10">
        {/*
         * With the panel open above the breakpoint, the box gives up the
         * panel's width, so the panel opens beside it rather than over it —
         * same duration and easing as the panel.
         */}
        <div
          data-panel={editing ? "true" : undefined}
          className="h-full transition-[margin] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] invite:data-[panel=true]:mr-invite-panel"
        >
          <div className="elevation-page h-full overflow-hidden rounded-xs border border-neutral-400">
            <ModularInvitation
              design={design}
              basics={basics}
              language={language}
              onRsvp={() => toast.show(t("testReply"), "warning")}
            />
          </div>
        </div>
        <ModularEditPanel open={editing} onClose={() => setEditing(false)} />
      </div>
    </EditorFrame>
  );
}
