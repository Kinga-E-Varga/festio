import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NoticeCard } from "@/components/NoticeCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: t("contact") };
}

/**
 * Where every "contact us" leads. Only a notice until the contact form is
 * built (`context/features/pending/contact-page.md`).
 */
export default async function ContactPage() {
  const t = await getTranslations("Contact");
  return <NoticeCard title={t("title")}>{t("soon")}</NoticeCard>;
}
