"use client";

import { useTranslations } from "next-intl";
import {
  type FormEventHandler,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { BTN_GHOST_LIGHT } from "@/components/dashboard/event-editor/styles";
import {
  ALERT,
  FADE_IN,
  GUEST_BTN_PRIMARY,
  SMALL_BTN_WARN,
  SMALL_BTN_WARN_SOLID,
} from "@/components/dashboard/guest-list/styles";

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
  const prompt = useRef<HTMLDivElement>(null);
  const asked = pending?.asked ?? null;

  /* The Edit click that raised the prompt may be far down the list; so may every click after it. */
  useEffect(() => {
    if (asked === null) return;
    prompt.current?.scrollIntoView({ block: "nearest" });
    prompt.current?.querySelector("button")?.focus();
  }, [asked]);

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
          <button type="submit" className={GUEST_BTN_PRIMARY}>
            {t("save")}
          </button>
        </div>

        {pending ? (
          <div
            ref={prompt}
            role="alert"
            className={`${ALERT} flex scroll-mt-[88px] scroll-mb-4 flex-wrap items-center gap-2.5`}
          >
            <span className="mr-auto">{t("unsaved")}</span>
            <div className="flex shrink-0 gap-2.5">
              <button
                type="button"
                onClick={pending.onDiscard}
                className={SMALL_BTN_WARN}
              >
                {t("discard")}
              </button>
              <button
                type="button"
                onClick={pending.onKeep}
                className={SMALL_BTN_WARN_SOLID}
              >
                {t("keepEditing")}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </form>
  );
}
