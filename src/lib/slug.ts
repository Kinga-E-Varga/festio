import { LANGUAGES } from "@/lib/language";

/**
 * Subdomains Festio keeps for itself: ones it may need, and ones that would
 * look official and could fool guests. Names shorter than `SLUG_MIN` stay
 * listed, so the list holds if the minimum ever drops. Adding one only blocks
 * new links, never ones already taken.
 */
export const RESERVED_SLUGS: readonly string[] = [
  /* Festio's own. */
  "www",
  "app",
  "api",
  "admin",
  "mail",
  "email",
  "smtp",
  "status",
  "help",
  "support",
  "docs",
  "blog",
  "cdn",
  "static",
  "assets",
  "auth",
  "login",
  "dev",
  "staging",
  "test",
  "festio",
  "dashboard",
  "settings",
  "official",
  /* Accounts and money. */
  "account",
  "signin",
  "signup",
  "security",
  "billing",
  "payment",
  "payments",
  "invoice",
  ...LANGUAGES,
];

export const SLUG_MIN = 6;
export const SLUG_MAX = 32;

/** A finished slug: lowercase letters and digits, single hyphens between them. */
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Slugs carry lowercase letters, digits and single hyphens, nothing else, and
 * no hyphen at either end: a subdomain name can't start or end with one.
 */
export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug);
}

/** A link a host may take: the right length and shape, and not reserved. */
export function isValidSlug(slug: string): boolean {
  return (
    slug.length >= SLUG_MIN &&
    slug.length <= SLUG_MAX &&
    SLUG_PATTERN.test(slug) &&
    !isReservedSlug(slug)
  );
}

/**
 * Alternatives for a slug someone already has: the event's year first, then a
 * counter. Only ones that still fit and aren't reserved; whether each is free
 * is the server's to check.
 */
export function slugSuggestions(
  slug: string,
  year: string,
  count = 3,
): string[] {
  const base = slug.replace(/-+$/, "");
  const candidates = base.endsWith(`-${year}`) ? [] : [`${base}-${year}`];
  for (let index = 2; candidates.length < count + 6; index++) {
    candidates.push(`${base}-${index}`);
  }
  return candidates
    .filter(
      (candidate) => candidate.length <= SLUG_MAX && !isReservedSlug(candidate),
    )
    .slice(0, count);
}
