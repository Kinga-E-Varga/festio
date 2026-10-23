"use client";

import {
  type AbstractIntlMessages,
  NextIntlClientProvider,
  useLocale,
  useMessages,
  useTranslations,
} from "next-intl";
import { type ReactNode, Suspense, useState } from "react";
import { useToast } from "@/components/dashboard/Toast";
import type { CardOpening } from "@/components/envelope/card";
import { cardValues } from "@/lib/invitation";
import type { Language } from "@/lib/language";
import { TemplateCard } from "@/templates/TemplateCard";
import type { InvitationSaving } from "@/types/dashboard";
import type { InvitationTemplate, TemplateValues } from "@/types/invitation";
import { EditPanel } from "./EditPanel";
import { EditorFrame } from "./EditorFrame";
import { useTabViews, type PanelTabId } from "./PanelTabs";
import { Invitation } from "./Invitation";
import { useInvitationSave } from "./useInvitationSave";

interface HostInvitationEditorProps {
  template: InvitationTemplate;
  initial: TemplateValues;
  /** The saved envelope switch; on for a card never saved. */
  initialEnvelope?: boolean;
  /** The invitation's own language — what the card's date is written in. */
  language: Language;
  /**
   * The invitation's catalog, when its language is not the host's. The
   * guest page inside is drawn in it; absent, it shares the host's.
   */
  guestMessages?: AbstractIntlMessages;
  /** Where BACK goes when no Festio page is behind this one: the event's Overview. */
  backTo?: string;
  /** The event Save writes to. Absent (a template's preview), Save keeps it in memory. */
  saving?: InvitationSaving;
}

/**
 * The host sees exactly what a guest sees, plus a layer of their own that the
 * invitation draws inside itself. The state stays here: the invitation is
 * handed the values and the rendered host surfaces, and hands nothing back.
 */
export function HostInvitationEditor({
  template,
  initial,
  initialEnvelope = true,
  language,
  guestMessages,
  backTo,
  saving,
}: HostInvitationEditorProps) {
  const t = useTranslations("HostEditor");
  const hostLocale = useLocale();
  const hostMessages = useMessages();
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  /* Closed on arrival: the host sees the invitation first and opens the panel from the strip. */
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<PanelTabId>("content");
  const [envelope, setEnvelope] = useState(initialEnvelope);
  const [savedEnvelope, setSavedEnvelope] = useState(initialEnvelope);
  /* Not saved: only to compare the two ways out while they are tried. */
  const [opening, setOpening] = useState<CardOpening>("rise");
  const toast = useToast();
  const views = useTabViews();
  const { save, sending, dialog } = useInvitationSave(saving, toast);

  function change(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
  }

  function switchEnvelope(on: boolean) {
    setEnvelope(on);
  }

  const dirty =
    envelope !== savedEnvelope ||
    Object.keys(values).some((id) => values[id] !== saved[id]);

  /*
   * The edit panel is drawn inside the invitation, so under its language.
   * It is the host's, so it gets the host's catalog back.
   */
  function asHost(node: ReactNode) {
    return (
      <NextIntlClientProvider locale={hostLocale} messages={hostMessages}>
        {node}
      </NextIntlClientProvider>
    );
  }

  const invitation = (
    <Invitation
      template={template}
      values={values}
      fill
      replyInert={editing}
      envelope={envelope}
      opening={opening}
      /*
       * The host can try the form out, every check included, but the editor
       * never saves a reply — only the guest page will.
       */
      onSubmit={async () => {
        toast.show(t("testReply"), "warning");
        return { success: true, data: undefined };
      }}
      host={asHost(
        <EditPanel
          template={template}
          values={values}
          language={language}
          open={editing}
          tab={tab}
          onChange={change}
          envelope={envelope}
          onEnvelope={switchEnvelope}
          opening={opening}
          onOpening={setOpening}
          onClose={() => setEditing(false)}
        />,
      )}
    >
      <Suspense fallback={null}>
        {/* The date is written out here, not in the template — see `cardValues`. */}
        <TemplateCard id={template.id} values={cardValues(values, language)} />
      </Suspense>
    </Invitation>
  );

  return (
    <>
      <EditorFrame
        backTo={backTo}
        views={views}
        view={tab}
        open={editing}
        onView={(id) => {
          setTab(id);
          setEditing(true);
        }}
        onClose={() => setEditing(false)}
        action={{
          kind: "save",
          dirty: dirty && !sending,
          onSave: () =>
            save({ kind: "simple", values, envelope }, () => {
              setSaved(values);
              setSavedEnvelope(envelope);
            }),
        }}
        toast={toast}
      >
        {guestMessages ? (
          <NextIntlClientProvider locale={language} messages={guestMessages}>
            {invitation}
          </NextIntlClientProvider>
        ) : (
          invitation
        )}
      </EditorFrame>
      {dialog}
    </>
  );
}
