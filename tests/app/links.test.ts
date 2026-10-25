import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { SEED_HOST } from "../../seed/build";
import { createEvent, guestInput } from "../helpers/events";
import { seedEvent } from "../helpers/seed";
import { action, guestPage, inviteHost, page } from "./fetch";
import { APP_BASE } from "./global";
import { hostCookie, OTHER_HOST } from "./session";

/*
 * Invitations live on their own subdomain, the host app on the base domain.
 * Expected results from the spec (`subdomain-links.md`).
 */

const PROTECTED = seedEvent("maria-andrei");

/**
 * The page's heading as shown. Not `mentions`: a guest page's data carries
 * its whole message catalog, shown or not.
 */
function heading(body: string): string | undefined {
  return body
    .match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]
    ?.replaceAll(/&#x27;|&#39;/g, "'");
}
const SLUG = PROTECTED.event.slug;
/* A 404 has no language of its own: English. */
const INVITE_MISSING = "This invitation can't be found.";
const PAGE_MISSING = "This page can't be found.";

test("a path link is not found", async () => {
  const { status, body } = await page(`/${SLUG}`);
  expect(status).toBe(404);
  expect(heading(body)).toBe(PAGE_MISSING);
});

test("only / is an invitation on a subdomain", async () => {
  expect((await page("/", undefined, inviteHost(SLUG))).status).toBe(200);
  for (const path of ["/dashboard", "/sign-in", "/ro"]) {
    const { status, body } = await page(path, undefined, inviteHost(SLUG));
    expect(status, path).toBe(404);
    expect(heading(body), path).toBe(INVITE_MISSING);
  }
});

test("invite paths are not found on any host", async () => {
  const onApp = await page(`/invite/${SLUG}`);
  expect(onApp.status).toBe(404);
  expect(heading(onApp.body)).toBe(PAGE_MISSING);
  const onOther = await page(
    `/invite/${SLUG}`,
    undefined,
    inviteHost("botez-sofia"),
  );
  expect(onOther.status).toBe(404);
  expect(heading(onOther.body)).toBe(INVITE_MISSING);
});

test("a two-level subdomain is not found", async () => {
  const { status, body } = await page("/", undefined, inviteHost(`a.${SLUG}`));
  expect(status).toBe(404);
  expect(heading(body)).toBe(INVITE_MISSING);
});

test("www goes to the host app", async () => {
  const { status, location } = await page(
    "/sign-in",
    undefined,
    `www.${APP_BASE}`,
  );
  expect(status).toBe(308);
  expect(location).toBe(`https://${APP_BASE}/sign-in`);
});

test("the host app works as before", async () => {
  expect((await page("/sign-in")).status).toBe(200);
  expect((await page("/ro/sign-in")).status).toBe(200);
});

test("the password unlocks on the subdomain", async () => {
  const { status, setCookie } = await action(
    "src/actions/guest.ts",
    "unlockInvitation",
    {
      path: "/",
      host: inviteHost(SLUG),
      args: [SLUG, PROTECTED.event.password],
    },
  );
  expect(status).toBe(200);
  expect(setCookie).toContain(`unlock-${SLUG}=`);
  /* Each invitation is its own site: the cookie never reaches another. */
  expect(setCookie?.toLowerCase()).not.toContain("domain=");
});

test("a guest's reply is sent on the subdomain", async () => {
  /* Its own event, another host's: the seed host's newest reply stays as `access.test.ts` sent it. */
  const { id, doc } = await createEvent({ hostId: OTHER_HOST.uid });
  await db.doc(paths.slug(doc.slug)).set({ eventId: id });
  const input = guestInput(["Subdomain Guest"]);
  const { status, body } = await action("src/actions/guest.ts", "sendReply", {
    path: "/",
    host: inviteHost(doc.slug),
    args: [doc.slug, input],
  });
  expect(status).toBe(200);
  expect(body).toContain('"success":true');
  expect((await db.doc(paths.reply(id, input.id)).get()).exists).toBe(true);
});

/*
 * A page's own `notFound()` is drawn by the browser as it recovers: the HTML
 * carries only the page data, so the check is the not-found page's props.
 */
test("an unknown subdomain shows Festio's not-found page", async () => {
  const { status, body } = await guestPage("nobody-has-this");
  expect(status).toBe(404);
  expect(body).toContain('\\"kind\\":\\"invite\\"');
});

test("a host page that finds nothing shows Festio's not-found page", async () => {
  const { status, body } = await page(
    "/dashboard/events/no-such-event",
    await hostCookie(SEED_HOST),
  );
  expect(status).toBe(404);
  expect(body).toContain('\\"kind\\":\\"page\\"');
});

test("an address with a dot is Festio's 404 page", async () => {
  /* A real file still loads. */
  expect((await page("/festio-icon-colour.svg")).status).toBe(200);
  for (const host of [undefined, inviteHost(SLUG)]) {
    const { status, body } = await page("/missing.png", undefined, host);
    expect(status, host).toBe(404);
    expect(heading(body), host).toBe(host ? INVITE_MISSING : PAGE_MISSING);
  }
});

test("a deleted event's link is no longer available", async () => {
  /* Seed: its data is deleted, so its link is blocked. */
  const { body } = await guestPage("cumetrie-luca");
  expect(heading(body)).toBe("This invitation is no longer available.");
  expect(body).toContain("noindex");
});
