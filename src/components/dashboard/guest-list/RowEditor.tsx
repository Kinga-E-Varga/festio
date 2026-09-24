"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BTN_DANGER,
  BTN_GHOST,
  BTN_PRIMARY,
  ERROR,
  INPUT,
  LABEL,
} from "@/components/dashboard/event-editor/styles";
import { NAME_LIMIT } from "@/components/invitation/useRsvpForm";
import { Icon } from "@/components/icons";
import type { RowValues } from "@/types/guests";

interface RowEditorProps {
  initial: RowValues;
  /** Waiting names have no reply, so nothing to say about coming. */
  withStatus: boolean;
  onSave: (values: RowValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
  /** Whether the fields differ from how they started; typing it back clears it. */
  onDirty: (dirty: boolean) => void;
  pending: { onDiscard: () => void; onKeep: () => void } | null;
}

const STATUSES = [
  { value: "going", key: "statusGoing" },
  { value: "not_going", key: "statusNotGoing" },
] as const;

/** One row's inputs. Stacks on narrow screens, sits in a line on wide ones. */
export function RowEditor({ initial, withStatus, onSave, onCancel, onDelete, onDirty, pending }: RowEditorProps) {
  const t = useTranslations("GuestList");
  const { register, handleSubmit, setFocus, formState } = useForm<RowValues>({ defaultValues: initial });
  const [confirming, setConfirming] = useState(false);
  const name = register("name", {
    validate: (value) => value.trim() !== "" || t("nameRequired"),
    maxLength: NAME_LIMIT,
  });
  const { isDirty } = formState;

  const prompt = useRef<HTMLDivElement>(null);
  const prompting = pending !== null;

  useEffect(() => setFocus("name"), [setFocus]);
  useEffect(() => onDirty(isDirty), [onDirty, isDirty]);

  /* The Edit click that raised the prompt may be far down the list. */
  useEffect(() => {
    if (!prompting) return;
    prompt.current?.scrollIntoView({ block: "nearest" });
    prompt.current?.querySelector("button")?.focus();
  }, [prompting]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-wrap items-end gap-3 bg-mustard-50 px-3 py-3.5">
      <label className="min-w-[200px] flex-1">
        <span className={`mb-1.5 block ${LABEL}`}>{t("name")}</span>
        <input {...name} maxLength={NAME_LIMIT} className={INPUT} />
        {formState.errors.name ? (
          <span className={`mt-1 block ${ERROR}`}>{formState.errors.name.message}</span>
        ) : null}
      </label>

      {withStatus ? (
        <fieldset>
          <legend className={`mb-1.5 ${LABEL}`}>{t("status")}</legend>
          <div className="flex">
            {STATUSES.map((status) => (
              <label key={status.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={status.value}
                  {...register("status")}
                  className="peer sr-only"
                />
                <span className="-ml-px block border border-mustard-300 bg-neutral-50 px-3 py-[9px] text-[13px] text-neutral-800 transition-colors peer-checked:border-forest-500 peer-checked:bg-forest-500 peer-checked:text-neutral-50 peer-focus-visible:outline-2 peer-focus-visible:outline-mustard-500">
                  {t(status.key)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button type="submit" className={BTN_PRIMARY}>{t("save")}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>{t("cancel")}</button>
        {onDelete ? (
          <button type="button" onClick={() => setConfirming(true)} className={BTN_DANGER}>
            <Icon name="trash" className="size-4" />
            {t("delete")}
          </button>
        ) : null}
      </div>

      {confirming && onDelete ? (
        <div role="alert" className="flex basis-full flex-wrap items-center gap-2.5 text-[12.5px] text-rust-600">
          <span className="mr-auto">{t("deleteConfirm", { name: initial.name })}</span>
          <button type="button" onClick={onDelete} className={BTN_DANGER}>{t("delete")}</button>
          <button type="button" onClick={() => setConfirming(false)} className={BTN_GHOST}>{t("cancel")}</button>
        </div>
      ) : null}

      {pending ? (
        <div ref={prompt} role="alert" className="flex basis-full flex-wrap items-center gap-2.5 text-[12.5px] text-terracotta-600">
          <span className="mr-auto">{t("unsaved")}</span>
          <button type="button" onClick={pending.onDiscard} className={BTN_GHOST}>{t("discard")}</button>
          <button type="button" onClick={pending.onKeep} className={BTN_PRIMARY}>{t("keepEditing")}</button>
        </div>
      ) : null}
    </form>
  );
}
