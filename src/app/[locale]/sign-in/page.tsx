import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthPage } from "@/components/auth/AuthPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("signIn"), robots: { index: false, follow: false } };
}

export default function SignInPage() {
  return <AuthPage mode="sign-in" />;
}
