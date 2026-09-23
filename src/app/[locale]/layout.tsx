import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { HistoryTracker } from "@/components/HistoryTracker";
import { appFontClassName } from "@/app/fonts";
import "@/app/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return { title: "Festio", description: t("description") };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The root layout for every host-facing route (dashboard, editor, landing
 * page). Guest invitation links (`/[invite]`, rewritten from `/maria-birthday-1657`
 * via `next.config.ts`) are a separate root layout outside next-intl.
 */
export default async function LocaleRootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className={`${appFontClassName} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-sm">
        <NextIntlClientProvider>
          <HistoryTracker />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
