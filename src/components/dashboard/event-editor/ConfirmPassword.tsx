"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { ERROR, INPUT } from "@/components/dashboard/event-editor/styles";
import type { HostLogin } from "@/db/reads/host";
import type { SaveError } from "@/db/writes/save";
import { orFailed } from "@/lib/action";
import { confirmIdentity } from "@/lib/reauth";
import type { ActionResult } from "@/types/actions";

/** Firebase's codes for a password that isn't right. */
const WRONG_PASSWORD = ["auth/invalid-credential", "auth/wrong-password"];
/** Firebase's codes for a Google window the host closed: not an error. */
const CLOSED_POPUP = [
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
];

/**
 * Runs a step that can't be undone once the host has proved it's them: a
 * fresh sign-in in the browser, its token checked again by the action. A
 * wrong password (or another Google account) shows under the field; anything
 * else goes to `onError`, for a toast. True once the action succeeded.
 */
export function useConfirmIdentity(
  login: HostLogin,
  onError: (message: string) => void,
) {
  const t = useTranslations("EventEditor");
  const tError = useTranslations("SaveErrors");
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);

  async function signInAgain(password: string): Promise<string | null> {
    try {
      return await confirmIdentity(login, password);
    } catch (error) {
      const code = String((error as { code?: unknown }).code);
      if (WRONG_PASSWORD.includes(code)) setWrong(true);
      else if (!CLOSED_POPUP.includes(code)) onError(tError("failed"));
      return null;
    }
  }

  async function run(
    password: string,
    action: (idToken: string) => Promise<ActionResult<undefined, SaveError>>,
  ): Promise<boolean> {
    setWrong(false);
    setBusy(true);
    const idToken = await signInAgain(password);
    const result = idToken ? await orFailed(action(idToken)) : null;
    /* Done, it stays busy: the page moves on (Home, or the cancelled row). */
    if (result?.success) return true;
    setBusy(false);
    if (result?.error === "wrongPassword") setWrong(true);
    else if (result) onError(tError(result.error));
    return false;
  }

  const error = wrong
    ? login.password
      ? tError("wrongPassword")
      : t("confirmGoogleWrong")
    : null;
  return { run, busy, error };
}

/**
 * Asked before a step that can't be undone (cancelling, deleting a past
 * event): the host's account password, or for a Google-only account a note
 * that Google's window opens instead.
 */
export function ConfirmPassword({
  id,
  login,
  field,
  error,
}: {
  id: string;
  login: HostLogin;
  field: UseFormRegisterReturn;
  error: string | null;
}) {
  const t = useTranslations("EventEditor");

  if (!login.password) {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="hint-text">{t("confirmGoogleNote")}</p>
        {error ? <p className={ERROR}>{error}</p> : null}
      </div>
    );
  }

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
        aria-invalid={error ? true : undefined}
        {...field}
        className={`${INPUT} @min-[420px]:max-w-[280px]`}
      />
      {error ? <p className={ERROR}>{error}</p> : null}
      <p className="hint-text">{t("confirmPasswordHint")}</p>
    </div>
  );
}
