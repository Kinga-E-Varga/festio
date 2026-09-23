/**
 * The languages Festio speaks. One list, read by both things that need it:
 * `next-intl`'s routing for the host app's own locale, and an invitation's
 * `language` field for what its guests see. They are the same set of
 * languages but never the same choice — a Hungarian host may send a
 * Romanian invitation.
 */
export const LANGUAGES = ["en", "ro", "hu"] as const;

export type Language = (typeof LANGUAGES)[number];

/**
 * What an invitation speaks when nothing says otherwise — including every
 * invitation that existed before the field did, which is why the field is
 * optional rather than backfilled.
 */
export const DEFAULT_LANGUAGE: Language = "en";

/** The language an invitation is written in. Never the host's app locale. */
export function invitationLanguage(invitation: {
  language?: Language;
}): Language {
  return invitation.language ?? DEFAULT_LANGUAGE;
}

/**
 * How each language is named to a host picking one — in that language, so
 * the option is readable to whoever the invitation is actually for.
 */
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  ro: "Română",
  hu: "Magyar",
};

/**
 * The BCP 47 tag `Intl` wants. Regional, not bare: dates written for guests
 * follow the convention of the country the language is spoken in, and
 * `en` alone would resolve to the American order.
 */
export const LANGUAGE_LOCALE: Record<Language, string> = {
  en: "en-GB",
  ro: "ro-RO",
  hu: "hu-HU",
};

/**
 * Copy that Festio ships in every language it speaks. A plain string is copy
 * that reads the same whichever language the invitation is in — a name, an
 * address, a format id — and is handed back untouched.
 *
 * The translated form is a full `Record`, not a partial one, so a template
 * cannot ship a language short: TypeScript refuses it before the card can
 * render a hole where a line should be.
 */
export type LocalizedText = string | Record<Language, string>

/** One piece of localized copy, in the language it is being read in. */
export function localized(text: LocalizedText, language: Language): string {
  return typeof text === "string" ? text : text[language]
}
