import type { Metadata } from "next";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { MissingPage } from "@/components/MissingPage";
import { appFontClassName } from "@/app/fonts";
import { loadMessages } from "@/i18n/messages";
import { DEFAULT_LANGUAGE } from "@/lib/language";
import { siteFor } from "@/lib/domain";
import "@/app/globals.css";

export const metadata: Metadata = { title: "Festio" };

/**
 * Every 404, both root layouts': Next renders it outside them. On an
 * invitation's subdomain it's that link's not-found, on the host app a plain
 * missing page. In the default language: a 404 has no language of its own.
 */
export default async function GlobalNotFound() {
  const site = siteFor((await headers()).get("host") ?? "");
  const { Missing } = await loadMessages(DEFAULT_LANGUAGE);
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      className={`${appFontClassName} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-sm">
        <NextIntlClientProvider
          locale={DEFAULT_LANGUAGE}
          messages={{ Missing }}
        >
          <MissingPage kind={site.kind === "invite" ? "invite" : "page"} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
