import { describe, expect, test } from "vitest";
import { isValidSlug, normalizeSlug, RESERVED_SLUGS } from "@/lib/slug";

/* A slug is a subdomain name now: expected values from the spec (`subdomain-links.md`). */

describe("normalizeSlug", () => {
  test("trims hyphens at both ends", () => {
    expect(normalizeSlug("-Maria Wedding-")).toBe("maria-wedding");
    expect(normalizeSlug("--maria--wedding--")).toBe("maria-wedding");
    expect(normalizeSlug("maria-")).toBe("maria");
  });

  test("turns other characters into single hyphens", () => {
    expect(normalizeSlug("Ana & Vlad!")).toBe("ana-vlad");
  });
});

describe("isValidSlug", () => {
  test("takes 6 to 32 characters", () => {
    expect(isValidSlug("ana-50")).toBe(true);
    expect(isValidSlug("maria")).toBe(false);
    expect(isValidSlug("a".repeat(32))).toBe(true);
    expect(isValidSlug("a".repeat(33))).toBe(false);
  });

  test("refuses what isn't a subdomain name", () => {
    for (const slug of [
      "-maria-wedding",
      "maria-wedding-",
      "maria--wedding",
      "xn--maria",
      "Maria-Wedding",
      "maria_wedding",
      "maria.wedding",
    ]) {
      expect(isValidSlug(slug), slug).toBe(false);
    }
  });

  test("refuses Festio's reserved subdomains", () => {
    for (const slug of [
      "support",
      "billing",
      "staging",
      "dashboard",
      "account",
      "invoice",
      "payments",
      "official",
    ]) {
      expect(isValidSlug(slug), slug).toBe(false);
    }
  });

  test("app routes are no longer reserved", () => {
    expect(isValidSlug("sign-in")).toBe(true);
    expect(isValidSlug("invitations")).toBe(true);
  });

  test("keeps the short names and the languages listed", () => {
    for (const name of ["www", "app", "api", "cdn", "en", "ro", "hu"]) {
      expect(RESERVED_SLUGS, name).toContain(name);
    }
  });
});
