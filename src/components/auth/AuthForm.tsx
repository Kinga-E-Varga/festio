"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ComponentProps, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { startSession } from "@/actions/auth";
import {
  LINK_TEXT,
  BTN_GHOST_LIGHT,
  BTN_PRIMARY,
  ERROR,
  INPUT,
} from "@/components/dashboard/styles";
import { Checkbox } from "@/components/dashboard/event-editor/Checkbox";
import { ACCOUNT_PASSWORD_MIN, HOST_NAME_MAX } from "@/db/limits";
import { Link, useRouter } from "@/i18n/navigation";
import { clientAuth } from "@/lib/firebase-client";
import type { Language } from "@/lib/language";

export type AuthMode = "sign-in" | "sign-up";

interface AuthFields {
  name: string;
  email: string;
  password: string;
  terms: boolean;
}

/** Keys into `Auth` for what went wrong, in words a host can act on. */
type Problem =
  | "wrongLogin"
  | "emailTaken"
  | "passwordAccount"
  | "again"
  | "tooMany"
  | "offline"
  | "failed";

/** Firebase's error codes, as the host's problem; null for a popup they closed. */
function problemOf(error: unknown): Problem | null {
  switch ((error as { code?: unknown }).code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "wrongLogin";
    case "auth/email-already-in-use":
      return "emailTaken";
    case "auth/account-exists-with-different-credential":
      return "passwordAccount";
    case "auth/too-many-requests":
      return "tooMany";
    case "auth/network-request-failed":
      return "offline";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return null;
    default:
      return "failed";
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="label-caps">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={ERROR}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** The Terms box, on sign-up and on the step a new Google account gets. */
function TermsBox(props: ComponentProps<"input">) {
  const t = useTranslations("Auth");
  return (
    <label className="flex cursor-pointer items-start gap-[9px] meta-text">
      <Checkbox
        {...props}
        look={{
          box: "border-neutral-600 bg-neutral-50 checked:border-accent-800 checked:bg-accent-800",
          tick: "text-neutral-50",
        }}
      />
      {t("terms")}
    </label>
  );
}

/**
 * Sign in or sign up, by email and password or with Google. The browser
 * signs in with Firebase; the server turns that into the session and, for
 * a new host, the `users` card.
 */
export function AuthForm({ mode }: { mode: AuthMode }) {
  const t = useTranslations("Auth");
  const language = useLocale() as Language;
  const router = useRouter();
  const signUp = mode === "sign-up";
  const [problem, setProblem] = useState<Problem | null>(null);
  const [busy, setBusy] = useState(false);
  /* A Google sign-in with no account yet, waiting for the Terms. */
  const [waiting, setWaiting] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const { register, handleSubmit, trigger, getValues, formState } =
    useForm<AuthFields>({
      defaultValues: { name: "", email: "", password: "", terms: false },
    });
  const { errors } = formState;

  /**
   * Runs one sign-in try with the buttons locked; they unlock unless it ended
   * in navigating away. Any throw (Firebase, or the action's call) is shown.
   */
  async function run(task: () => Promise<boolean>) {
    setProblem(null);
    setBusy(true);
    let leaving = false;
    try {
      leaving = await task();
    } catch (error) {
      setProblem(problemOf(error));
    }
    if (!leaving) setBusy(false);
  }

  /** Hands the sign-in to the server; true when the dashboard is opening. */
  async function finish(
    idToken: string,
    acceptedTerms: boolean,
    name?: string,
  ): Promise<boolean> {
    const result = await startSession({
      idToken,
      language,
      acceptedTerms,
      name,
    });
    if (result.success) {
      await signOut(clientAuth());
      router.replace("/dashboard");
      return true;
    }
    /* "stale": the sign-in is too old to trust (a Terms step left open), so start over. */
    setWaiting(result.error === "terms" ? idToken : null);
    if (result.error === "stale") setAccepted(false);
    if (result.error !== "terms") {
      setProblem(result.error === "stale" ? "again" : "failed");
    }
    return false;
  }

  function attempt(signIn: () => Promise<UserCredential>, name?: string) {
    return run(async () => {
      const { user } = await signIn();
      return finish(
        await user.getIdToken(),
        signUp && getValues("terms"),
        name,
      );
    });
  }

  /*
   * A new login keeps the typed name too, so if the session fails now, the
   * card made at a later sign-in still gets it, not the email's first part.
   */
  async function createAccount(name: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(
      clientAuth(),
      email,
      password,
    );
    await updateProfile(credential.user, { displayName: name.trim() });
    return credential;
  }

  const submit = handleSubmit(({ name, email, password }) =>
    attempt(
      () =>
        signUp
          ? createAccount(name, email, password)
          : signInWithEmailAndPassword(clientAuth(), email, password),
      signUp ? name : undefined,
    ),
  );

  async function google() {
    /* Signing up takes the Terms first, whichever way. */
    if (signUp && !(await trigger("terms"))) return;
    await attempt(() =>
      signInWithPopup(clientAuth(), new GoogleAuthProvider()),
    );
  }

  if (waiting) {
    return (
      <div className="flex flex-col gap-4">
        <p className="body-text">{t("termsStep")}</p>
        <TermsBox
          checked={accepted}
          onChange={(control) => setAccepted(control.target.checked)}
        />
        {problem ? <p className={ERROR}>{t(problem)}</p> : null}
        <button
          type="button"
          disabled={!accepted || busy}
          onClick={() => void run(() => finish(waiting, true))}
          className={BTN_PRIMARY}
        >
          {t("createAccount")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {signUp ? (
          <Field id="auth-name" label={t("name")} error={errors.name?.message}>
            <input
              id="auth-name"
              type="text"
              autoComplete="name"
              maxLength={HOST_NAME_MAX}
              aria-invalid={errors.name ? true : undefined}
              {...register("name", {
                validate: (value) => value.trim() !== "" || t("nameRequired"),
              })}
              className={INPUT}
            />
          </Field>
        ) : null}

        <Field id="auth-email" label={t("email")} error={errors.email?.message}>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            {...register("email", {
              pattern: { value: EMAIL_PATTERN, message: t("emailInvalid") },
              required: t("emailInvalid"),
            })}
            className={INPUT}
          />
        </Field>

        <Field
          id="auth-password"
          label={t("password")}
          error={errors.password?.message}
        >
          <input
            id="auth-password"
            type="password"
            autoComplete={signUp ? "new-password" : "current-password"}
            aria-invalid={errors.password ? true : undefined}
            {...register("password", {
              required: t("passwordRequired"),
              ...(signUp && {
                minLength: {
                  value: ACCOUNT_PASSWORD_MIN,
                  message: t("passwordShort", { min: ACCOUNT_PASSWORD_MIN }),
                },
              }),
            })}
            className={INPUT}
          />
        </Field>

        {signUp ? (
          <div className="flex flex-col gap-1.5">
            <TermsBox
              {...register("terms", { required: t("termsRequired") })}
            />
            {errors.terms ? (
              <p className={ERROR}>{errors.terms.message}</p>
            ) : null}
          </div>
        ) : null}

        {problem ? (
          <p role="alert" className={ERROR}>
            {t(problem)}
          </p>
        ) : null}

        <button type="submit" disabled={busy} className={BTN_PRIMARY}>
          {signUp ? t("createAccount") : t("signIn")}
        </button>
      </form>

      <div className="flex items-center gap-3 hint-text text-neutral-700">
        <span className="h-px flex-1 bg-neutral-300" />
        {t("or")}
        <span className="h-px flex-1 bg-neutral-300" />
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => void google()}
        className={BTN_GHOST_LIGHT}
      >
        {t("google")}
      </button>

      <p className="text-center meta-text">
        {signUp ? t("haveAccount") : t("noAccount")}{" "}
        <Link href={signUp ? "/sign-in" : "/sign-up"} className={LINK_TEXT}>
          {signUp ? t("toSignIn") : t("toSignUp")}
        </Link>
      </p>
    </div>
  );
}
