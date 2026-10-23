"use client";

import {
  type AbstractIntlMessages,
  NextIntlClientProvider,
  useLocale,
  useMessages,
  useTranslations,
} from "next-intl";
import { type ReactNode, Suspense, useRef, useState } from "react";
import { saveInvitation } from "@/actions/invitation";
import { useSaveConfirm } from "@/components/dashboard/SaveConfirm";
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
  const tError = useTranslations("SaveErrors");
  const hostLocale = useLocale();
  const hostMessages = useMessages();
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  /* Closed on arrival: the host sees the invitation first and opens the panel from the strip. */
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<PanelTabId>("content");
  const [envelope, setEnvelope] = useState(initialEnvelope);
  const [savedEnvelope, setSavedEnvelope] = useState(initialEnvelope);
  /* The card's version this editor last saw: sent with each save. */
  const [version, setVersion] = useState(saving?.version ?? 0);
  /* A save is out: the ref is the instant guard, the state turns Save off. */
  const busy = useRef(false);
  const [sending, setSending] = useState(false);
  /* Not saved: only to compare the two ways out while they are tried. */
  const [opening, setOpening] = useState<CardOpening>("rise");
  const toast = useToast();
  const views = useTabViews();
  const confirm = useSaveConfirm(
    saving?.visibility ?? "hidden",
    saving?.replied ?? 0,
  );

  function change(id: string, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
  }

  function switchEnvelope(on: boolean) {
    setEnvelope(on);
  }

  function keep(nextValues: TemplateValues, nextEnvelope: boolean) {
    setSaved(nextValues);
    setSavedEnvelope(nextEnvelope);
    toast.show(t("saved"));
  }

  function save() {
    if (!saving) {
      keep(values, envelope);
      return;
    }
    if (busy.current) return;
    /* What is sent is what gets marked saved, even if the host types on meanwhile. */
    const sent = { values, envelope };
    confirm.ask(async () => {
      if (busy.current) return;
      busy.current = true;
      setSending(true);
      try {
        const result = await saveInvitation(saving.eventId, {
          kind: "simple",
          ...sent,
          version,
        });
        if (!result.success) {
          toast.show(tError(result.error), "error");
          return;
        }
        setVersion(result.data.version);
        keep(sent.values, sent.envelope);
      } catch {
        /* The request itself failed, e.g. offline. */
        toast.show(tError("failed"), "error");
      } finally {
        busy.current = false;
        setSending(false);
      }
    });
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
      onSubmit={() => toast.show(t("testReply"), "warning")}
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
        action={{ kind: "save", dirty: dirty && !sending, onSave: save }}
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
      {confirm.dialog}
    </>
  );
}
