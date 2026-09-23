import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { loadMessages } from "@/i18n/messages";
import { routing } from "@/i18n/routing";

/*
 * A locale passed explicitly — `getTranslations({ locale })`, for copy that
 * follows an invitation's language — wins over the one in the URL.
 */
export default getRequestConfig(async ({ locale: explicit, requestLocale }) => {
  const requested = explicit ?? (await requestLocale);
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return { locale, messages: await loadMessages(locale) };
});
