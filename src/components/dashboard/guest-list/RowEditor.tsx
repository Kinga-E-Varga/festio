"use client";

import { useTranslations } from "next-intl";
import {
  type FormEventHandler,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import {
  ALERT,
  BTN_EDITOR,
  BTN_EDITOR_OUTLINE,
  FADE_IN,
  SMALL_BTN_WARN,
  SMALL_BTN_WARN_SOLID,
} from "@/components/dashboard/guest-list/styles";

export interface RowEditorProps {
  onCancel: () => void;
  /** Whether the fields differ from how they started; typing it back clears it. */
  onDirty: (dirty: boolean) => void;
  pending: { onDiscard: () => void; onKeep: () => void } | null;
}

interface FrameProps extends Pick<RowEditorProps, "onCancel" | "pending"> {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

/** The editors' shared frame, at most 500px wide: the fields, then Cancel / Save, then the unsaved-changes prompt when it's raised. */
export function RowEditor({
  onSubmit,
  onCancel,
  pending,
  children,
}: FrameProps) {
  const t = useTranslations("GuestList");
  const prompt = useRef<HTMLDivElement>(null);
  const prompting = pending !== null;

  /* The Edit click that raised the prompt may be far down the list. */
  useEffect(() => {
    if (!prompting) return;
    prompt.current?.scrollIntoView({ block: "nearest" });
    prompt.current?.querySelector("button")?.focus();
  }, [prompting]);

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`-mx-3 my-1 flex max-w-[500px] flex-col gap-4 bg-mustard-100 px-3 pt-3 pb-4 ${FADE_IN}`}
    >
      {children}

      {/* Side by side, sharing the editor's full width. */}
      <div className="grid grid-cols-2 gap-2.5 border-t border-mustard-300 pt-4">
        <button type="button" onClick={onCancel} className={BTN_EDITOR_OUTLINE}>
          {t("cancel")}
        </button>
        <button type="submit" className={BTN_EDITOR}>
          {t("save")}
        </button>
      </div>

      {pending ? (
        <div
          ref={prompt}
          role="alert"
          className={`${ALERT} flex flex-wrap items-center gap-2.5`}
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
    </form>
  );
}
