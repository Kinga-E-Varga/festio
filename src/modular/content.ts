import { formatDay, pad } from "@/lib/event";
import { LANGUAGE_LOCALE, localized, type Language } from "@/lib/language";
import type {
  InvitationBasics,
  ListItem,
  SectionDefinition,
  SectionValues,
} from "@/types/modular";

const DAY_MS = 86_400_000;

/**
 * A section's sample content in one language. Phase 1 has no event, so
 * every field is its own fallback; phase 2 lays the host's values over it.
 */
export function sectionValues(
  definition: SectionDefinition,
  language: Language,
): SectionValues {
  const values: SectionValues = {};
  for (const field of definition.fields) {
    values[field.id] =
      field.type === "list"
        ? field.fallback.map((item) =>
            Object.fromEntries(
              Object.entries(item).map(([id, copy]) => [
                id,
                localized(copy, language),
              ]),
            ),
          )
        : localized(field.fallback, language);
  }
  return values;
}

/** One plain value; empty when the field is missing or is a list. */
export function text(values: SectionValues, id: string): string {
  const value = values[id];
  return typeof value === "string" ? value : "";
}

/** One list's items; empty when the field is missing or is not a list. */
export function list(values: SectionValues, id: string): ListItem[] {
  const value = values[id];
  return Array.isArray(value) ? value : [];
}

/** "Maria & Andrei" — or just "Maria" for one host. */
export function hostNames(basics: InvitationBasics): string {
  return basics.hosts.join(" & ");
}

/** "M & A" — the top bar's mark. */
export function hostInitials(basics: InvitationBasics): string {
  return basics.hosts
    .map((name) => name.trim().charAt(0).toUpperCase())
    .join(" & ");
}

function day(iso: string): Date {
  return new Date(`${iso}T00:00`);
}

/** "Saturday", in the invitation's language. */
export function weekday(iso: string, language: Language): string {
  return day(iso).toLocaleDateString(LANGUAGE_LOCALE[language], {
    weekday: "long",
  });
}

/** "12 June 2027", in the invitation's language. */
export function longDate(iso: string, language: Language): string {
  return formatDay(iso, language);
}

/** "12 · 06 · 2027" — the cover's numeric line, the same in every language. */
export function dottedDate(iso: string): string {
  const date = day(iso);
  return `${pad(date.getDate())} · ${pad(date.getMonth() + 1)} · ${date.getFullYear()}`;
}

/** Whole days from now to the date, never below zero. */
export function daysUntil(iso: string, now: Date = new Date()): number {
  return Math.max(0, Math.ceil((day(iso).getTime() - now.getTime()) / DAY_MS));
}

/**
 * A web address a host typed, only when it is one: anything but http(s) is
 * dropped, so a link on the invitation can never run script.
 */
export function safeLink(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}
