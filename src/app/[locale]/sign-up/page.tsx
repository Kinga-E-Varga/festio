import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AuthPage } from "@/components/auth/AuthPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("signUp"), robots: { index: false, follow: false } };
}

export default function SignUpPage() {
  return <AuthPage mode="sign-up" />;
}
