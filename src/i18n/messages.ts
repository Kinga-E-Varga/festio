import type { Language } from "@/lib/language";

/**
 * One catalog, for one language. The only place the path to `messages/` is
 * written: the host app reaches it through `request.ts`, and guest pages
 * reach it directly, because an invitation's language is its own and has
 * nothing to do with the request's locale.
 */
export async function loadMessages(language: Language) {
  return (await import(`../../messages/${language}.json`)).default;
}
