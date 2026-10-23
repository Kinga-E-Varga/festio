"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { unlockInvitation } from "@/actions/guest";
import { orFailed } from "@/lib/action";
import {
  BOXED_INPUT,
  REPLY_LABEL,
  REPLY_NOTE,
  REPLY_TITLE,
  SOLID,
  WARNING,
} from "./styles";

type GateError = "wrong" | "tooMany" | "failed";

const MESSAGE: Record<GateError, string> = {
  wrong: "passwordWrong",
  tooMany: "tooMany",
  failed: "tryAgain",
};

/**
 * A Protected invitation's door: the password from the printed card. The
 * server checks it; once it's right, its cookie reloads the page into the
 * invitation. The password never reaches this browser.
 */
export function PasswordGate({ slug }: { slug: string }) {
  const t = useTranslations("Rsvp");
  const { register, handleSubmit, formState } = useForm<{ password: string }>({
    defaultValues: { password: "" },
  });
  const [error, setError] = useState<GateError | null>(null);

  async function open({ password }: { password: string }) {
    setError(null);
    const result = await orFailed(unlockInvitation(slug, password));
    if (!result.success) setError(result.error);
  }

  return (
    <form onSubmit={handleSubmit(open)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className={REPLY_TITLE}>{t("passwordTitle")}</h1>
        <p className={REPLY_NOTE}>{t("passwordHint")}</p>
      </div>
      <label className="flex flex-col gap-2">
        <span className={REPLY_LABEL}>{t("passwordLabel")}</span>
        <input
          {...register("password", { required: true })}
          type="password"
          autoComplete="off"
          autoFocus
          className={BOXED_INPUT}
        />
      </label>
      {error ? (
        <p role="alert" className={WARNING}>
          {t(MESSAGE[error])}
        </p>
      ) : null}
      <button type="submit" disabled={formState.isSubmitting} className={SOLID}>
        {t("passwordSubmit")}
      </button>
    </form>
  );
}
