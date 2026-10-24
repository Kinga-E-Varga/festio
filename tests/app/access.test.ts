import { Timestamp } from "firebase-admin/firestore";
import { beforeAll, expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { eventSchema, eventSettingsSchema } from "@/db/schemas/event";
import { unlockToken } from "@/db/secret";
import { writeEventSettings } from "@/db/writes/event";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { writeInvitation } from "@/db/writes/invitation";
import ro from "../../messages/ro.json";
import { SEED_HOST } from "../../seed/build";
import { guestInput, newVisitor } from "../helpers/events";
import { mentions } from "../helpers/page-text";
import { seedEvent } from "../helpers/seed";
import { action, page } from "./fetch";
import { hostCookie, OTHER_HOST, unlockHeader } from "./session";

/*
 * Who sees what, on the pages themselves. Expected results come from the
 * spec (`context/project-overview.md`, `database.md` → Link previews).
 */

const PROTECTED = seedEvent("maria-andrei");
const HIDDEN = seedEvent("aniversare-50");
const CANCELLED = seedEvent("logodna-ana-vlad");
/* Read by no other page test: the cache checks change its cards, then put them back. */
const CACHED = seedEvent("botez-sofia");
const PROTECTED_TEXT = "sărbătoriți nunta noastră";
const CANCELLED_TEXT = "Doar pe invitație, niciodată după anulare";
const CANCEL_MESSAGE = "Ne pare rău, petrecerea se amână.";
/* The seed host's newest reply, sent in `beforeAll`. */
const NEWEST_GUEST = "Panel Check Newest";

beforeAll(async () => {
  /* With a template, so only Hidden can keep its page away (no template is "not found" anyway). */
  await db.doc(paths.event(HIDDEN.id)).update({ templateId: "wolf-dance" });
  /*
   * Its seed card has no template either; and its own text, to look for,
   * written straight to the card, so the event card names its version as a save would.
   */
  await db
    .doc(paths.event(CANCELLED.id))
    .update({ templateId: "wolf-dance", invitationVersion: 1 });
  await db.doc(paths.invitation(CANCELLED.id)).set({
    kind: "simple",
    values: { title1: CANCELLED_TEXT },
    envelope: true,
    version: 1,
  });
  await writeGuestReply(
    PROTECTED.id,
    PROTECTED.event.slug,
    guestInput([NEWEST_GUEST]),
    {
      ...newVisitor(),
      unlock: unlockToken(PROTECTED.id, PROTECTED.event.password ?? ""),
    },
    new Date(),
  );
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

test("the latest replies come only when asked, and only the host's own", async () => {
  const [own, other] = await Promise.all([
    hostCookie(SEED_HOST),
    hostCookie(OTHER_HOST),
  ]);
  const latest = (cookie?: string) =>
    action("src/actions/host.ts", "loadLatestReplies", {
      path: "/dashboard",
      cookie,
    });

  /* The page alone no longer carries them: the panel asks when it opens. */
  const home = await page("/dashboard", own);
  expect(home.status).toBe(200);
  expect(mentions(home.body, NEWEST_GUEST)).toBe(false);

  const asked = await latest(own);
  expect(asked.status).toBe(200);
  expect(mentions(asked.body, NEWEST_GUEST)).toBe(true);
  /* Another host's answer works, it just holds none of these replies. */
  const others = await latest(other);
  expect(others.status).toBe(200);
  expect(others.body).toContain('"success":true');
  expect(mentions(others.body, NEWEST_GUEST)).toBe(false);
  /* Signed out, the action goes to sign-in instead. */
  const signedOut = await latest();
  expect(signedOut.redirect).toContain("/sign-in");
  expect(mentions(signedOut.body, NEWEST_GUEST)).toBe(false);
});

/**
 * Runs a check on the cached event with a template, then puts its cards back
 * as seeded: the event, its link, no invitation and no other link.
 */
async function onCachedEvent(check: () => Promise<void>, newSlug?: string) {
  const eventRef = db.doc(paths.event(CACHED.id));
  const slugRef = db.doc(paths.slug(CACHED.event.slug));
  const [event, link] = await Promise.all([eventRef.get(), slugRef.get()]);
  /* Its seed card has no template, and the guest page needs one. */
  await eventRef.update({ templateId: "wolf-dance" });
  try {
    await check();
  } finally {
    await Promise.all([
      eventRef.set(event.data() ?? {}),
      slugRef.set(link.data() ?? {}),
      db.doc(paths.invitation(CACHED.id)).delete(),
      newSlug && db.doc(paths.slug(newSlug)).delete(),
    ]);
  }
}

/** Saves the cached event's invitation with this title, from the version it has. */
function saveCachedInvitation(title1: string, version: number) {
  return writeInvitation(SEED_HOST.uid, CACHED.id, async () => ({
    kind: "simple",
    values: { title1 },
    envelope: true,
    version,
  }));
}

test("a new invitation version is read fresh", async () => {
  const path = `/${CACHED.event.slug}`;
  await onCachedEvent(async () => {
    await saveCachedInvitation("First cached title", 0);
    /* Shown once, so this server keeps it. */
    expect(mentions((await page(path)).body, "First cached title")).toBe(true);

    await saveCachedInvitation("Second cached title", 1);
    const { status, body } = await page(path);
    expect(status).toBe(200);
    expect(mentions(body, "Second cached title")).toBe(true);
    expect(mentions(body, "First cached title")).toBe(false);
  });
});

test("a cached link that no longer matches is read again", async () => {
  const oldPath = `/${CACHED.event.slug}`;
  const newSlug = "botez-sofia-moved";
  await onCachedEvent(async () => {
    /* Shown once, so this server keeps the link. */
    expect((await page(oldPath)).status).toBe(200);

    const card = await db.doc(paths.event(CACHED.id)).get();
    const event = eventSchema.parse(card.data());
    await writeEventSettings(
      SEED_HOST.uid,
      CACHED.id,
      eventSettingsSchema.parse({ ...event, slug: newSlug }),
      new Date(),
    );
    expect((await page(oldPath)).status).toBe(404);
    const moved = await page(`/${newSlug}`);
    expect(moved.status).toBe(200);
    expect(mentions(moved.body, CACHED.event.title)).toBe(true);
  }, newSlug);
});
