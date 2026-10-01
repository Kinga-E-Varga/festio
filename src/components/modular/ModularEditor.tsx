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
 * The modular template page: the guest page with the editor's top bar above
 * it and the edit panel beside it. Same bar, same panel shell, same toasts as
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
      <ModularInvitation
        design={design}
        basics={basics}
        language={language}
        panelOpen={editing}
        onRsvp={() => toast.show(t("testReply"), "warning")}
        host={
          <ModularEditPanel open={editing} onClose={() => setEditing(false)} />
        }
      />
    </EditorFrame>
  );
}
