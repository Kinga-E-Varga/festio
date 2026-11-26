"use client";

import { useTranslations } from "next-intl";
import { NoticeCard } from "@/components/NoticeCard";

/**
 * A page that isn't there: an invitation link that opens nothing (`invite`),
 * one whose event's data is deleted (`gone`), or any other address (`page`).
 * Festio's own look, as there is no invitation to dress it. A client
 * component so its words come from the provider around it: the invite
 * layout's (the invitation's language, the default for an unknown link), or
 * English on the global 404 page.
 */
export function MissingPage({ kind }: { kind: "invite" | "gone" | "page" }) {
  const t = useTranslations("Missing");
  return <NoticeCard title={t(`${kind}Title`)}>{t(`${kind}Body`)}</NoticeCard>;
}
