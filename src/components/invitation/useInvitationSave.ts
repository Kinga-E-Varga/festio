"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { saveInvitation } from "@/actions/invitation";
import { useSaveConfirm } from "@/components/dashboard/SaveConfirm";
import type { useToast } from "@/components/dashboard/Toast";
import type { InvitationDoc } from "@/db/schemas/invitation";
import { orFailed } from "@/lib/action";
import type { InvitationSaving } from "@/types/dashboard";

/** An invitation card as an editor sends it: the hook adds the version. */
type UnsavedCard<Card = InvitationDoc> = Card extends unknown
  ? Omit<Card, "version">
  : never;

/**
 * Save for both invitation editors: the confirm while guests can see it,
 * one save at a time, the version sent and kept, and the outcome as a
 * toast. Without `saving` (a template's preview) it keeps in memory only.
 * `keep` marks what was sent as saved, even if the host edited on meanwhile.
 */
export function useInvitationSave(
  saving: InvitationSaving | undefined,
  toast: Pick<ReturnType<typeof useToast>, "show">,
) {
  const t = useTranslations("HostEditor");
  const tError = useTranslations("SaveErrors");
  /* The card's version this editor last saw: sent with each save. */
  const [version, setVersion] = useState(saving?.version ?? 0);
  /* A save is out: the ref is the instant guard, the state turns Save off. */
  const busy = useRef(false);
  const [sending, setSending] = useState(false);
  const confirm = useSaveConfirm(
    saving?.visibility ?? "hidden",
    saving?.replied ?? 0,
  );

  function kept(keep: () => void) {
    keep();
    toast.show(t("saved"));
  }

  function save(card: UnsavedCard, keep: () => void) {
    if (!saving) {
      kept(keep);
      return;
    }
    if (busy.current) return;
    confirm.ask(async () => {
      if (busy.current) return;
      busy.current = true;
      setSending(true);
      const result = await orFailed(
        saveInvitation(saving.eventId, { ...card, version }),
      );
      busy.current = false;
      setSending(false);
      if (!result.success) {
        toast.show(tError(result.error), "error");
        return;
      }
      setVersion(result.data.version);
      kept(keep);
    });
  }

  return { save, sending, dialog: confirm.dialog };
}
