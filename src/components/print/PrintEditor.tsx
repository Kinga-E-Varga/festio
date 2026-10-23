"use client";

import { useTranslations } from "next-intl";
import { type CSSProperties, useState } from "react";
import { savePrintSettings } from "@/actions/event";
import { useToast } from "@/components/dashboard/Toast";
import { EditorFrame } from "@/components/invitation/EditorFrame";
import { printVars, templateFontVars } from "@/lib/invitation";
import type { InvitationTemplate } from "@/types/invitation";
import type { PrintSettings } from "@/types/print";
import { PrintPanel } from "./PrintPanel";
import { PrintPreview } from "./PrintPreview";

/**
 * The print page's own palette. A printable is Festio's artifact, not the
 * invitation's — the template's colours stop at the card's artwork, and the
 * page around it is painted from here. The strip and the form are the
 * editors' own, in the app's palette.
 *
 * Same var names as a template's palette, so the leaf faces read this
 * without knowing they are on the print page. `--print-ground` is the page
 * behind the paper.
 */
const PRINT_PALETTE = {
  "--c1": "#2F281F",
  "--c2": "#8D7D6A",
  "--c3": "#F8F2E0",
  "--c4": "#8D7D6A",
  "--c5": "#C6B379",
  "--c6": "#7B2C30",
  "--print-ground": "var(--color-neutral-50)",
} as CSSProperties;

interface PrintEditorProps {
  eventId: string;
  /** The settings saved at the last export; without them, the defaults. */
  initial?: PrintSettings;
  template: InvitationTemplate;
  /**
   * The invitation's own RSVP message — where the printable's larger line
   * starts. The two part company from the first keystroke; this is a default,
   * not a binding.
   */
  rsvpMessage: string;
  /** The guest-facing address, printed on the card. */
  link: string;
  /** Printed under the link on Protected invitations, in their language. */
  passwordLine?: string;
  /**
   * The line the second input opens on, until the host writes their own.
   * Festio's copy, and it is printed, so it arrives already written in the
   * invitation's language — never the locale the host reads Festio in.
   */
  defaultNote: string;
  /** Where BACK goes when no Festio page is behind this one: the event's Overview. */
  backTo?: string;
}

/**
 * The print page. It is laid out like the invitation editor and takes the
 * same frame and panel, but what fills the middle is a sheet of paper being turned
 * rather than the invitation itself, and the panel beside it settles the
 * paper rather than the copy.
 *
 * Export keeps the settings on the event; the file itself is not made yet.
 */
export function PrintEditor({
  eventId,
  initial,
  template,
  rsvpMessage,
  link,
  passwordLine,
  defaultNote,
  backTo,
}: PrintEditorProps) {
  const [settings, setSettings] = useState<PrintSettings>(
    initial ?? {
      shape: "flat",
      tinted: true,
      headline: rsvpMessage,
      note: defaultNote,
    },
  );
  /*
   * Answered at every width. Below the breakpoint the form covers the
   * paper; above it the form sits beside the paper and closing it hands the
   * width over — see `.sheet-form`. Closed on arrival: the host sees the
   * paper first and opens the form from the strip.
   */
  const [editing, setEditing] = useState(false);
  const t = useTranslations("HostEditor");
  const tError = useTranslations("SaveErrors");
  const toast = useToast();

  async function exportPrint() {
    try {
      const result = await savePrintSettings(eventId, settings);
      if (!result.success) {
        toast.show(tError(result.error), "error");
        return;
      }
      toast.show(t("exported"));
    } catch {
      /* The request itself failed, e.g. offline. */
      toast.show(tError("failed"), "error");
    }
  }

  function change<Key extends keyof PrintSettings>(
    key: Key,
    value: PrintSettings[Key],
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  return (
    <EditorFrame
      backTo={backTo}
      views={[{ id: "settings", label: t("settings"), icon: "printer" }]}
      view="settings"
      open={editing}
      onView={() => setEditing(true)}
      onClose={() => setEditing(false)}
      action={{ kind: "export", onExport: exportPrint }}
      toast={toast}
    >
      <div
        style={{
          ...templateFontVars(template),
          ...printVars(template),
          ...PRINT_PALETTE,
        }}
        className={`invite relative overflow-hidden ${template.fonts.primary.className} ${template.fonts.secondary.className} bg-[var(--print-ground)] flex h-full flex-col invite:flex-row`}
      >
        {/*
         * The sheet sizes itself against what is left beside the panel or
         * the strip — never partly behind either.
         */}
        <div className="relative flex min-h-0 min-w-0 flex-1">
          <PrintPreview
            settings={settings}
            link={link}
            passwordLine={passwordLine}
          />
        </div>

        <PrintPanel
          settings={settings}
          open={editing}
          onChange={change}
          onClose={() => setEditing(false)}
        />
      </div>
    </EditorFrame>
  );
}
