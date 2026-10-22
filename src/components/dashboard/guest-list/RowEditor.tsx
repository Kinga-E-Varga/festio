"use client";

import { useTranslations } from "next-intl";
import { UnsavedPrompt } from "@/components/dashboard/UnsavedPrompt";
import type { FormEventHandler, ReactNode } from "react";
import {
  BTN_GHOST_LIGHT,
  BTN_PRIMARY,
} from "@/components/dashboard/event-editor/styles";
import { FADE_IN } from "@/components/dashboard/guest-list/styles";

export interface RowEditorProps {
  onCancel: () => void;
  /** Whether the fields differ from how they started; typing it back clears it. */
  onDirty: (dirty: boolean) => void;
  /** `asked` goes up with every click held back, each one bringing the prompt into view. */
  pending: { onDiscard: () => void; onKeep: () => void; asked: number } | null;
}

interface FrameProps extends Pick<RowEditorProps, "onCancel" | "pending"> {
  onSubmit: FormEventHandler<HTMLFormElement>;
  /** In a `Dialog`: no box of its own, and Cancel / Save pinned to its bottom. */
  inDialog?: boolean;
  children: ReactNode;
}

/** The editors' shared frame, at most 500px wide: the fields, then Cancel / Save, then the unsaved-changes prompt when it's raised. */
export function RowEditor({
  onSubmit,
  onCancel,
  pending,
  inDialog = false,
  children,
}: FrameProps) {
  const t = useTranslations("GuestList");

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={
        inDialog
          ? "mt-4 flex flex-col gap-4"
          : `flex max-w-[500px] flex-col gap-4 px-3 pt-3 pb-4 ${FADE_IN}`
      }
    >
      {children}

      {/* Pinned in a dialog, so the way out and its prompt stay in sight while the form scrolls. */}
      <div
        className={
          inDialog
            ? "sticky bottom-0 flex flex-col gap-4 bg-neutral-50 pt-3 pb-5"
            : "contents"
        }
      >
        {/* Side by side, sharing the editor's full width. */}
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={onCancel} className={BTN_GHOST_LIGHT}>
            {t("cancel")}
          </button>
          <button type="submit" className={BTN_PRIMARY}>
            {t("save")}
          </button>
        </div>

        {pending ? (
          <UnsavedPrompt
            title={t("unsaved")}
            discardLabel={t("discard")}
            keepLabel={t("keepEditing")}
            onDiscard={pending.onDiscard}
            onKeep={pending.onKeep}
            asked={pending.asked}
          />
        ) : null}
      </div>
    </form>
  );
}
