"use client";

import { useTranslations } from "next-intl";
import { type CSSProperties, useState } from "react";
import { useToast } from "@/components/dashboard/Toast";
import { EditorFrame } from "@/components/invitation/EditorTopBar";
import { printVars, templateFontVars } from "@/lib/invitation";
import type { InvitationTemplate } from "@/types/invitation";
import type { PrintSettings } from "@/types/print";
import { PrintPanel } from "./PrintPanel";
import { PrintPreview } from "./PrintPreview";

/**
 * The print page's own palette. A printable is Festio's artifact, not the
 * invitation's — the template's colours stop at the card's artwork, and the
 * page around it is painted from here. The top bar and the form are the
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
  "--print-ground": "var(--color-mustard-50)",
} as CSSProperties;

interface PrintEditorProps {
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
  /** The top bar's title — the event's. No tags: they are the invitation's, not the printable's. */
  title: string;
}

/**
 * The print page. It is laid out like the invitation editor and takes the
 * same top bar and panel, but what fills the middle is a sheet of paper being turned
 * rather than the invitation itself, and the panel beside it settles the
 * paper rather than the copy.
 *
 * Export does nothing yet beyond saying so.
 */
export function PrintEditor({
  template,
  rsvpMessage,
  link,
  passwordLine,
  defaultNote,
  title,
}: PrintEditorProps) {
  const [settings, setSettings] = useState<PrintSettings>({
    shape: "flat",
    tinted: true,
    headline: rsvpMessage,
    note: defaultNote,
  });
  /*
   * Answered at every width. Below the breakpoint the form covers the
   * paper; above it the form sits beside the paper and closing it hands the
   * width over — see `.sheet-form`.
   */
  const [editing, setEditing] = useState(true);
  const t = useTranslations("HostEditor");
  const toast = useToast();

  function change<Key extends keyof PrintSettings>(
    key: Key,
    value: PrintSettings[Key],
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  return (
    <EditorFrame
      title={title}
      editing={editing}
      onToggleEdit={() => setEditing(!editing)}
      action={{ kind: "export", onExport: () => toast.show(t("exported")) }}
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
         * The sheet sizes itself against what is left beside the panel, and
         * the top bar above both — never partly behind either.
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
