import { LANGUAGES } from "./language";

/*
 * Relative imports only: `next.config.ts` reads this file for its invite
 * rewrite, and path aliases don't resolve there.
 */

/**
 * Top-level paths the host app owns, so no guest link may take them. Every
 * top-level folder under `app/[locale]` and `app/` belongs here, plus each
 * locale prefix.
 */
export const RESERVED_SLUGS: readonly string[] = [
  "dashboard",
  "invitations",
  "templates",
  "prints",
  "invite",
  "api",
  ...LANGUAGES,
];

export const SLUG_MIN = 6;
export const SLUG_MAX = 32;

/**
 * The path pattern of a guest link: one top-level segment of slug characters
 * that isn't reserved. Written for `next.config.ts` rewrites (path-to-regexp),
 * which allow only non-capturing groups.
 */
export const INVITE_PATH_PATTERN = `(?!(?:${RESERVED_SLUGS.join("|")})$)[a-z0-9-]+`;

/** Slugs carry lowercase letters, digits and single hyphens, nothing else. */
export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug);
}

/**
 * Free alternatives for a slug someone already has: the event's year first,
 * then a counter. Only ones that are free and still fit are offered.
 */
export function slugSuggestions(
  slug: string,
  year: string,
  taken: readonly string[],
  count = 3,
): string[] {
  const base = slug.replace(/-+$/, "");
  const candidates = base.endsWith(`-${year}`) ? [] : [`${base}-${year}`];
  for (let index = 2; candidates.length < count + 6; index++) {
    candidates.push(`${base}-${index}`);
  }
  return candidates
    .filter(
      (candidate) =>
        candidate.length <= SLUG_MAX &&
        !taken.includes(candidate) &&
        !isReservedSlug(candidate),
    )
    .slice(0, count);
}
