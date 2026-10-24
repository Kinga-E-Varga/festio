import { Timestamp } from "firebase-admin/firestore";
import { beforeAll, expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import ro from "../../messages/ro.json";
import { SEED_HOST } from "../../seed/build";
import { mentions } from "../helpers/page-text";
import { seedEvent } from "../helpers/seed";
import { page } from "./fetch";
import { hostCookie, OTHER_HOST, unlockHeader } from "./session";

/*
 * Who sees what, on the pages themselves. Expected results come from the
 * spec (`context/project-overview.md`, `database.md` → Link previews).
 */

const PROTECTED = seedEvent("maria-andrei");
const HIDDEN = seedEvent("aniversare-50");
const CANCELLED = seedEvent("logodna-ana-vlad");
const PROTECTED_TEXT = "sărbătoriți nunta noastră";
const CANCELLED_TEXT = "Doar pe invitație, niciodată după anulare";
const CANCEL_MESSAGE = "Ne pare rău, petrecerea se amână.";

beforeAll(async () => {
  /* With a template, so only Hidden can keep its page away (no template is "not found" anyway). */
  await db.doc(paths.event(HIDDEN.id)).update({ templateId: "wolf-dance" });
  /* Its seed card has no template either; and its own text, to look for. */
  await db.doc(paths.event(CANCELLED.id)).update({ templateId: "wolf-dance" });
  await db.doc(paths.invitation(CANCELLED.id)).set({
    kind: "simple",
    values: { title1: CANCELLED_TEXT },
    envelope: true,
    version: 1,
  });
});

test("another host's event is not found", async () => {
  const [own, other] = await Promise.all([
    hostCookie(SEED_HOST),
    hostCookie(OTHER_HOST),
  ]);
  const id = PROTECTED.id;
  const pages = [
    `/dashboard/events/${id}`,
    `/dashboard/events/${id}/details`,
    `/dashboard/events/${id}/guests`,
    `/invitations/${id}`,
    `/prints/${id}`,
  ];
  await Promise.all(
    pages.map(async (path) => {
      /* The page is there for its own host, so the 404 is about who asks. */
      expect((await page(path, own)).status, path).toBe(200);
      expect((await page(path, other)).status, path).toBe(404);
    }),
  );
});

test("signed out, a host page goes to sign-in", async () => {
  const { status, location } = await page("/dashboard");
  expect([302, 303, 307, 308]).toContain(status);
  expect(location).toContain("/sign-in");
});

test("a Hidden invitation is not found", async () => {
  const path = `/${HIDDEN.event.slug}`;
  const card = db.doc(paths.event(HIDDEN.id));
  /* Public, the same page opens: so the 404 after is Hidden's doing. */
  await card.update({ visibility: "public" });
  expect((await page(path)).status).toBe(200);
  await card.update({ visibility: "hidden" });
  expect((await page(path)).status).toBe(404);
});

test("a Protected invitation shows only the password screen", async () => {
  const { status, body } = await page(`/${PROTECTED.event.slug}`);
  expect(status).toBe(200);
  /* The password screen's own heading: proves it is what rendered. */
  expect(mentions(body, ro.Rsvp.passwordTitle)).toBe(true);
  expect(mentions(body, PROTECTED.event.title)).toBe(false);
  expect(mentions(body, PROTECTED_TEXT)).toBe(false);
});

test("an unlocked Protected invitation shows the invitation", async () => {
  const { status, body } = await page(
    `/${PROTECTED.event.slug}`,
    unlockHeader(PROTECTED),
  );
  expect(status).toBe(200);
  expect(mentions(body, PROTECTED.event.title)).toBe(true);
  expect(mentions(body, PROTECTED_TEXT)).toBe(true);
});

test("a cancelled invitation shows only the host's message", async () => {
  const path = `/${CANCELLED.event.slug}`;
  /* Before: the invitation shows its text, so its absence after means something. */
  expect(mentions((await page(path)).body, CANCELLED_TEXT)).toBe(true);

  await db.doc(paths.event(CANCELLED.id)).update({
    cancelled: { message: CANCEL_MESSAGE, at: Timestamp.now() },
  });
  const { status, body } = await page(path);
  expect(status).toBe(200);
  expect(mentions(body, CANCEL_MESSAGE)).toBe(true);
  expect(mentions(body, CANCELLED_TEXT)).toBe(false);
});
