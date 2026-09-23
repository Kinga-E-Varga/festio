import type { routing } from "@/i18n/routing";

/* Types `useLocale` / `getLocale` as one of `LANGUAGES`, not a bare string. */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
  }
}
