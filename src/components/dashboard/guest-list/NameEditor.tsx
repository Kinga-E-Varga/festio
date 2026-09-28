"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NameField } from "@/components/dashboard/guest-list/ReplyFields";
import { RowEditor, type RowEditorProps } from "@/components/dashboard/guest-list/RowEditor";
import { NAME_LIMIT } from "@/components/invitation/useRsvpForm";

interface NameEditorProps extends RowEditorProps {
  initial: string;
  onSave: (name: string) => void;
}

/** A waiting name has no reply, so only the name to fix. */
export function NameEditor({ initial, onSave, onCancel, onDirty, pending }: NameEditorProps) {
  const t = useTranslations("GuestList");
  const { register, handleSubmit, setFocus, formState } = useForm<{ name: string }>({
    defaultValues: { name: initial },
  });
  const { isDirty } = formState;

  useEffect(() => setFocus("name"), [setFocus]);
  useEffect(() => onDirty(isDirty), [onDirty, isDirty]);

  return (
    <RowEditor onSubmit={handleSubmit((values) => onSave(values.name))} onCancel={onCancel} pending={pending}>
      <NameField
        registration={register("name", {
          validate: (value) => value.trim() !== "" || t("nameRequired"),
          maxLength: NAME_LIMIT,
        })}
        error={formState.errors.name?.message}
      />
    </RowEditor>
  );
}
