import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { HistoryTracker } from "@/components/HistoryTracker";
import { ReactGrab } from "@/app/ReactGrab";
import { loadMessages } from "@/i18n/messages";
import { DEFAULT_LANGUAGE } from "@/lib/language";

import { loadEventBySlug } from "@/db/reads/events";
import { appFontClassName } from "@/app/fonts";
import "@/app/globals.css";

/**
 * The invitation's own language, or the default for a link that matches none.
 */
async function inviteLanguage(invite: string) {
  const event = await loadEventBySlug(invite);
  return event?.language ?? DEFAULT_LANGUAGE;
}

/**
 * A separate root layout from `[locale]` — guest invitation links have no
 * language switch and stay outside next-intl's routing entirely. Lives under
 * a literal `invite/` folder (not `[invite]` at the app root) because
 * Next.js disallows two differently-named dynamic segments as siblings;
 * `src/proxy.ts` rewrites the real URL (`maria-birthday-1657.festio.eu`)
 * here invisibly.
 */
export async function generateMetadata({
  params,
}: LayoutProps<"/invite/[invite]">): Promise<Metadata> {
  const { invite } = await params;
  const t = await getTranslations({
    locale: await inviteLanguage(invite),
    namespace: "Meta",
  });
  return { title: "Festio", description: t("description") };
}

export default async function InviteRootLayout({
  children,
  params,
}: LayoutProps<"/invite/[invite]">) {
  const { invite } = await params;

  /*
   * A guest page speaks the invitation's own language, so the provider is
   * given one explicitly rather than reading the request's locale — there
   * is no locale in this URL to read. An unknown link has no invitation to
   * ask, and the page below turns it into a 404; the default only dresses
   * that page.
   */
  const language = await inviteLanguage(invite);
  const messages = await loadMessages(language);

  return (
    <html lang={language} className={`${appFontClassName} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-sm">
        <NextIntlClientProvider locale={language} messages={messages}>
          <ReactGrab />
          <HistoryTracker />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
