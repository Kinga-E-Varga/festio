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
import { cardValues } from "@/lib/invitation";
import type { Language } from "@/lib/language";
import { TemplateCard } from "@/templates/TemplateCard";
import type { InvitationTemplate, TemplateValues } from "@/types/invitation";
import { EditPanel } from "./EditPanel";
import { EditorFrame, type EditorStatus } from "./EditorTopBar";
import { Invitation } from "./Invitation";

interface HostInvitationEditorProps {
  template: InvitationTemplate;
  initial: TemplateValues;
  /** The invitation's own language — what the card's date is written in. */
  language: Language;
  /**
   * The invitation's catalog, when its language is not the host's. The
   * guest page inside is drawn in it; absent, it shares the host's.
   */
  guestMessages?: AbstractIntlMessages;
  /** The top bar's title — the event's, or the template's on a preview. */
  title: string;
  status?: EditorStatus;
}

/**
 * The host sees exactly what a guest sees, plus a layer of their own that the
 * invitation draws inside itself. The state stays here: the invitation is
 * handed the values and the rendered host surfaces, and hands nothing back.
 */
export function HostInvitationEditor({
  template,
  initial,
  language,
  guestMessages,
  title,
  status,
}: HostInvitationEditorProps) {
  const t = useTranslations("HostEditor");
  const hostLocale = useLocale();
  const hostMessages = useMessages();
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [justSaved, setJustSaved] = useState(false);
  const [editing, setEditing] = useState(true);
  const toast = useToast();

  function change(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
    setJustSaved(false);
  }

  function save() {
    setSaved(values);
    setJustSaved(true);
    toast.show(t("saved"));
  }

  const dirty = Object.keys(values).some((id) => values[id] !== saved[id]);

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
      /*
       * The host can try the form out, every check included, but the editor
       * never saves a reply — only the guest page will.
       */
      onSubmit={() => toast.show(t("testReply"), "warning")}
      host={asHost(
        <EditPanel
          template={template}
          values={values}
          language={language}
          open={editing}
          onChange={change}
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
    <EditorFrame
      title={title}
      status={status}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
      action={{ kind: "save", dirty, justSaved, onSave: save }}
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
  );
}
