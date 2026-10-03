"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/components/dashboard/Toast";
import { EditorFrame } from "@/components/invitation/EditorTopBar";
import type { Language } from "@/lib/language";
import { groundClasses } from "@/modular/styles";
import { modularVars } from "@/modular/vars";
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
 * The modular template page: the invitation as its shadowed column
 * on its own ground, with the editor's top bar above it and the edit panel
 * beside it. Same bar, same panel shell, same toasts as the simple editor. Nothing is editable yet, so nothing is ever unsaved and
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
      {/*
       * The invitation's own ground, the same as around its column on a wide
       * guest screen. It spans the whole area, under the panel too, so a
       * closing panel never drags the page behind it into view.
       */}
      <div
        style={modularVars(design.palette, design.fontPair)}
        className={`relative h-full ${groundClasses(design.pattern)}`}
      >
        {/*
         * With the panel open above the breakpoint, the invitation gives up
         * the panel's width, so the panel opens beside it rather than over
         * it — same duration and easing as the panel.
         */}
        <div
          data-panel={editing ? "true" : undefined}
          className="h-full px-3 pt-3 transition-[margin] duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:px-4.5 md:pt-4.5 invite:px-6 invite:pt-6 invite:data-[panel=true]:mr-invite-panel rail:px-10 rail:pt-10"
        >
          <ModularInvitation
            design={design}
            basics={basics}
            language={language}
            framed
            onRsvp={() => toast.show(t("testReply"), "warning")}
          />
        </div>
        <ModularEditPanel open={editing} onClose={() => setEditing(false)} />
      </div>
    </EditorFrame>
  );
}
