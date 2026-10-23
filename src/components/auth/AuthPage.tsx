import { getLocale, getTranslations } from "next-intl/server";
import { AuthForm, type AuthMode } from "@/components/auth/AuthForm";
import { CARD_FRAME, LOCKUP } from "@/components/dashboard/styles";
import { loadHostId } from "@/db/reads/session";
import { Link, redirect } from "@/i18n/navigation";

/** The sign-in and sign-up pages: one card on the page's ground. Signed in, it's the dashboard. */
export async function AuthPage({ mode }: { mode: AuthMode }) {
  if (await loadHostId()) {
    redirect({ href: "/dashboard", locale: await getLocale() });
  }
  const t = await getTranslations("Auth");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
      <Link href="/" aria-label="Festio">
        <span aria-hidden="true" className={`h-btn bg-primary-800 ${LOCKUP}`} />
      </Link>
      <div className={`w-full max-w-[400px] p-6 sm:p-8 ${CARD_FRAME}`}>
        <h1 className="mb-6 text-center page-title sm:mb-8">
          {mode === "sign-up" ? t("signUpTitle") : t("signInTitle")}
        </h1>
        <AuthForm mode={mode} />
      </div>
    </main>
  );
}
