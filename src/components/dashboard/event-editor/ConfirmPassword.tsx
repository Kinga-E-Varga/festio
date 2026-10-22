"use client";

import { useTranslations } from "next-intl";
import type { UseFormRegisterReturn } from "react-hook-form";
import { INPUT } from "@/components/dashboard/event-editor/styles";

/** The host's account password, asked before a step that can't be undone: cancelling, deleting a past event. */
export function ConfirmPassword({
  id,
  field,
}: {
  id: string;
  field: UseFormRegisterReturn;
}) {
  const t = useTranslations("EventEditor");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="muted-text">
        {t("confirmPasswordLabel")}
      </label>
      <input
        id={id}
        type="password"
        autoComplete="current-password"
        placeholder={t("confirmPasswordPlaceholder")}
        {...field}
        className={`${INPUT} @min-[420px]:max-w-[280px]`}
      />
      <p className="hint-text">{t("confirmPasswordHint")}</p>
    </div>
  );
}
