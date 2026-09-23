import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { HistoryTracker } from "@/components/HistoryTracker";
import { loadMessages } from "@/i18n/messages";
import { DEFAULT_LANGUAGE, invitationLanguage } from "@/lib/language";
import { findByInvite } from "@/lib/invitation";
import { EVENTS } from "@/mock/dashboard";
import { appFontClassName } from "@/app/fonts";
import "@/app/globals.css";

/**
 * A separate root layout from `[locale]` — guest invitation links have no
 * language switch and stay outside next-intl's routing entirely. Lives under
 * a literal `invite/` folder (not `[invite]` at the app root) because
 * Next.js disallows two differently-named dynamic segments as siblings;
 * `next.config.ts` rewrites the real, unprefixed URL
 * (`festio.eu/maria-birthday-1657`) here invisibly.
 */
export const metadata: Metadata = {
  title: "Festio",
  description: "Invitations, RSVPs and everything after.",
};

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
  const event = findByInvite(EVENTS, invite);
  const language = event ? invitationLanguage(event) : DEFAULT_LANGUAGE;
  const messages = await loadMessages(language);

  return (
    <html lang={language} className={`${appFontClassName} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-sm">
        <NextIntlClientProvider locale={language} messages={messages}>
          <HistoryTracker />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
