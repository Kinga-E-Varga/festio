"use client";

import { useTranslations } from "next-intl";
import { CARD_FRAME, LOCKUP } from "@/components/dashboard/styles";

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
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
      <span aria-hidden="true" className={`h-btn bg-primary-800 ${LOCKUP}`} />
      <div
        className={`flex w-full max-w-[400px] flex-col gap-3 p-6 text-center sm:p-8 ${CARD_FRAME}`}
      >
        <h1 className="card-title">{t(`${kind}Title`)}</h1>
        <p className="row-text">{t(`${kind}Body`)}</p>
      </div>
    </main>
  );
}
