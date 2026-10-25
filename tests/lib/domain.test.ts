import { expect, test } from "vitest";
import { siteFor, siteOrigin } from "@/lib/domain";
import { invitationLink, invitationUrl } from "@/lib/event";

/* Expected values from the spec (`subdomain-links.md` → Environments). */

test("siteFor tells the host app, www and invitations apart", () => {
  expect(siteFor("festio.eu", "festio.eu")).toEqual({ kind: "app" });
  expect(siteFor("www.festio.eu", "festio.eu")).toEqual({ kind: "www" });
  expect(siteFor("maria-wedding.festio.eu", "festio.eu")).toEqual({
    kind: "invite",
    slug: "maria-wedding",
  });
  expect(siteFor("Maria-Wedding.Festio.EU", "festio.eu")).toEqual({
    kind: "invite",
    slug: "maria-wedding",
  });
  /* Not a slug: the guest page refuses it. */
  expect(siteFor("a.b.festio.eu", "festio.eu")).toEqual({
    kind: "invite",
    slug: "a.b",
  });
  expect(siteFor("evilfestio.eu", "festio.eu")).toEqual({ kind: "app" });
});

test("siteFor works with a port and with staging", () => {
  expect(siteFor("localhost:3000", "localhost:3000")).toEqual({ kind: "app" });
  expect(siteFor("maria-wedding.localhost:3000", "localhost:3000")).toEqual({
    kind: "invite",
    slug: "maria-wedding",
  });
  /* A phone on the dev server's Wi-Fi address. */
  expect(siteFor("192.168.1.5:3000", "localhost:3000")).toEqual({
    kind: "app",
  });
  expect(
    siteFor("maria-wedding.staging.festio.eu", "staging.festio.eu"),
  ).toEqual({ kind: "invite", slug: "maria-wedding" });
});

test("siteFor ignores a trailing dot and a written-out port", () => {
  expect(siteFor("maria-wedding.festio.eu.", "festio.eu")).toEqual({
    kind: "invite",
    slug: "maria-wedding",
  });
  expect(siteFor("festio.eu.", "festio.eu")).toEqual({ kind: "app" });
  expect(siteFor("maria-wedding.festio.eu:443", "festio.eu")).toEqual({
    kind: "invite",
    slug: "maria-wedding",
  });
  expect(siteFor("www.festio.eu:443", "festio.eu")).toEqual({ kind: "www" });
  /* A base with a port keeps the host's own. */
  expect(siteFor("maria-wedding.localhost:3001", "localhost:3000")).toEqual({
    kind: "app",
  });
});

test("siteOrigin is https except on localhost", () => {
  expect(siteOrigin(undefined, "festio.eu")).toBe("https://festio.eu");
  expect(siteOrigin("maria-wedding", "festio.eu")).toBe(
    "https://maria-wedding.festio.eu",
  );
  expect(siteOrigin("maria-wedding", "localhost:3000")).toBe(
    "http://maria-wedding.localhost:3000",
  );
});

/* The tests set no base domain, so these see the default. */
test("the link is the slug on festio.eu", () => {
  expect(invitationLink({ slug: "maria-wedding" })).toBe(
    "maria-wedding.festio.eu",
  );
  expect(invitationUrl({ slug: "maria-wedding" })).toBe(
    "https://maria-wedding.festio.eu",
  );
});
