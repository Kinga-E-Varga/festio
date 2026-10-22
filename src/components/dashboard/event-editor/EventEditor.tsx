"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Toast, useToast } from "@/components/dashboard/Toast";
import { DangerZone } from "@/components/dashboard/event-editor/DangerZone";
import { DetailsSection } from "@/components/dashboard/event-editor/DetailsSection";
import { PackageSection } from "@/components/dashboard/event-editor/PackageSection";
import { GuestsSection } from "@/components/dashboard/event-editor/GuestsSection";
import { LinkSection } from "@/components/dashboard/event-editor/LinkSection";
import type { CardEditing } from "@/components/dashboard/event-editor/SettingsCard";
import { useEventForm } from "@/components/dashboard/event-editor/useEventForm";
import { useLeaveWarning } from "@/lib/leave-warning";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * Every editable part of one event record. The form holds the host's edits
 * until they save; nothing here is persisted yet.
 */
interface EventEditorProps {
  event: DashboardEvent;
  /** Every other event's slug, which this one's link must not repeat. */
  takenSlugs: string[];
}

/** The cards with fields behind an Edit; Package and Cancel or delete hold actions instead. */
type CardId = "general" | "replies" | "link";

export function EventEditor({ event, takenSlugs }: EventEditorProps) {
  const t = useTranslations("EventEditor");
  const form = useEventForm(event, takenSlugs);
  const toast = useToast();
  /* One card open at a time: Edit on another closes this one first. */
  const [open, setOpen] = useState<CardId | null>(null);
  /* The card asked for while the open one has unsaved changes, and how many times: the open card asks before they go. */
  const [pending, setPending] = useState<{
    card: CardId;
    asked: number;
  } | null>(null);
  useLeaveWarning(form.save.dirty, t("leaveUnsaved"));

  function editing(card: CardId): CardEditing {
    return {
      open: open === card,
      onEdit: () => {
        if (open !== null && form.save.dirty)
          setPending({ card, asked: (pending?.asked ?? 0) + 1 });
        else setOpen(card);
      },
      onCancel: () => {
        form.save.cancel();
        setOpen(null);
        setPending(null);
      },
      onSave: () => {
        if (!form.save.canSave) return;
        form.save.submit();
        setOpen(null);
        setPending(null);
        toast.show(t("saved"));
      },
      canSave: form.save.canSave,
      prompt:
        open === card && pending
          ? {
              asked: pending.asked,
              onKeep: () => setPending(null),
              onDiscard: () => {
                form.save.cancel();
                setOpen(pending.card);
                setPending(null);
              },
            }
          : null,
    };
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-5">
        <DetailsSection
          event={event}
          form={form}
          editing={editing("general")}
        />
        <LinkSection event={event} form={form} editing={editing("link")} />
        <GuestsSection event={event} form={form} editing={editing("replies")} />
        <PackageSection event={event} />
        <DangerZone event={event} onAction={toast.show} />
      </div>
      <Toast message={toast.message} tone={toast.tone} />
    </>
  );
}
