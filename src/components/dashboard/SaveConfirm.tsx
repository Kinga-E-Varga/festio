"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { Dialog, DialogActions } from "@/components/dashboard/Dialog";
import {
  BTN_GHOST_LIGHT,
  BTN_PRIMARY,
} from "@/components/dashboard/event-editor/styles";
import type { Visibility } from "@/types/dashboard";

interface SaveConfirmProps {
  /** Replies in so far. */
  replied: number;
  onAgree: () => void;
  onCancel: () => void;
}

/** The blocking warning before a save to an invitation guests can see. Esc or a click outside cancels. */
export function SaveConfirm({ replied, onAgree, onCancel }: SaveConfirmProps) {
  const t = useTranslations("SaveConfirm");
  return (
    <Dialog title={t("title")} onDismiss={onCancel}>
      <p className="row-text">{t("body", { count: replied })}</p>
      <DialogActions>
        <button type="button" onClick={onCancel} className={BTN_GHOST_LIGHT}>
          {t("cancel")}
        </button>
        <button type="button" onClick={onAgree} className={BTN_PRIMARY}>
          {t("agree")}
        </button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * `ask(save)` runs `save` at once while the invitation is Hidden; otherwise
 * it opens the confirm and runs `save` only if the host agrees. Show `dialog`
 * somewhere in the tree.
 */
export function useSaveConfirm(visibility: Visibility, replied: number) {
  const [saving, setSaving] = useState<(() => void) | null>(null);

  function ask(save: () => void) {
    if (visibility === "hidden") save();
    else setSaving(() => save);
  }

  const dialog: ReactNode = saving ? (
    <SaveConfirm
      replied={replied}
      onAgree={() => {
        saving();
        setSaving(null);
      }}
      onCancel={() => setSaving(null)}
    />
  ) : null;

  return { ask, dialog };
}
