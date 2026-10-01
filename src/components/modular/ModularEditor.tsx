"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Toast, useToast } from "@/components/dashboard/Toast";
import { HostBar } from "@/components/invitation/HostBar";
import { CheckIcon } from "@/components/invitation/icons";
import { HOST_ACTION } from "@/components/invitation/styles";
import { useLeaveFestio } from "@/lib/history";
import type { Language } from "@/lib/language";
import type { InvitationBasics, ModularDesign } from "@/types/modular";
import { ModularEditPanel } from "./ModularEditPanel";
import { ModularInvitation } from "./ModularInvitation";

interface ModularEditorProps {
  design: ModularDesign;
  basics: InvitationBasics;
  language: Language;
}

/**
 * The modular template page: the guest page with the host's bar above it
 * and the edit panel beside it. Same bar, same panel shell, same toasts as
 * the simple editor. The page stays scrollable and the RSVP form works; a
 * reply only ever shows the test toast.
 */
export function ModularEditor({
  design,
  basics,
  language,
}: ModularEditorProps) {
  const t = useTranslations("HostEditor");
  const [editing, setEditing] = useState(true);
  const toast = useToast();
  const leave = useLeaveFestio("/dashboard/events");

  return (
    <>
      <ModularInvitation
        design={design}
        basics={basics}
        language={language}
        panelOpen={editing}
        onRsvp={() => toast.show(t("testReply"), "warning")}
        hostBar={
          <HostBar
            onBack={leave}
            editing={editing}
            onToggleEdit={() => setEditing(!editing)}
            thirdAction={
              <button
                type="button"
                onClick={() => toast.show(t("saved"))}
                className={HOST_ACTION}
              >
                <CheckIcon size={14} />
                {t("save")}
              </button>
            }
          />
        }
        host={
          <ModularEditPanel open={editing} onClose={() => setEditing(false)} />
        }
      />
      <Toast message={toast.message} tone={toast.tone} />
    </>
  );
}
