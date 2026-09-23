import { defineRouting } from "next-intl/routing";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/lib/language";

/**
 * English is the default and stays unprefixed (`festio.eu/dashboard`);
 * Romanian and Hungarian are prefixed (`festio.eu/ro/dashboard`). This is
 * the host app's language only — separate from an invitation's own
 * `language` field, which is set per invitation and drives what guests see.
 */
export const routing = defineRouting({
  locales: LANGUAGES,
  defaultLocale: DEFAULT_LANGUAGE,
  localePrefix: "as-needed",
});
