"use client";

import { Toast, useToast } from "@/components/dashboard/Toast";
import { DangerZone } from "@/components/dashboard/event-editor/DangerZone";
import { DetailsSection } from "@/components/dashboard/event-editor/DetailsSection";
import { EditionSection } from "@/components/dashboard/event-editor/EditionSection";
import { GuestsSection } from "@/components/dashboard/event-editor/GuestsSection";
import { LinkSection } from "@/components/dashboard/event-editor/LinkSection";
import { RetentionSection } from "@/components/dashboard/event-editor/RetentionSection";
import { SaveBar } from "@/components/dashboard/event-editor/SaveBar";
import { useEventForm } from "@/components/dashboard/event-editor/useEventForm";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * Every editable part of one event record. The form holds the host's edits
 * until they save; nothing here is persisted yet.
 */
export function EventEditor({ event }: { event: DashboardEvent }) {
  const form = useEventForm(event);
  const toast = useToast();

  function save() {
    if (!form.save.canSave) return;
    form.save.submit();
    toast.show("Changes saved — your guests were not notified");
  }

  return (
    <>
      <DetailsSection event={event} form={form} />
      <LinkSection event={event} form={form} />
      <GuestsSection event={event} form={form} />
      <EditionSection event={event} />
      <RetentionSection
        event={event}
        deletionLabel={form.derived.deletionLabel}
        dateLabel={form.derived.dateLabel}
      />
      <DangerZone event={event} onAction={toast.show} />
      <SaveBar form={form} onSave={save} />
      <Toast message={toast.message} />
    </>
  );
}
