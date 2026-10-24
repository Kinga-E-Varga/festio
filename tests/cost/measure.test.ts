import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { Timestamp } from "firebase-admin/firestore";
import { beforeAll, expect, test } from "vitest";
import { auth, db } from "@/db/admin";
import { countDbUse, NO_DB_COUNT, takeDbCount, type DbCount } from "@/db/count";
import { paths } from "@/db/paths";
import { eventSettingsSchema } from "@/db/schemas/event";
import { writeEventSettings } from "@/db/writes/event";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { writeGuestChanges } from "@/db/writes/guests";
import { writeInvitation } from "@/db/writes/invitation";
import { fromGuestReplies, toGuestReplies } from "@/lib/guests";
import { guestInput, newVisitor, readEvent } from "../helpers/events";
import { appDbCount, page } from "../app/fetch";
import { hostCookie, unlockHeader } from "../app/session";
import { seedEvent } from "../helpers/seed";
import { SEED_HOST } from "../../seed/build";
import { month, monthInWords } from "./month";
import { compare, table, type Measured } from "./report";

/*
 * `npm run cost`: what every page and save asks of Firebase, against the
 * saved baseline. A rise fails the run; `COST_UPDATE=1 npm run cost` accepts
 * it as the new baseline. The run's table is kept in `last-run.md`.
 */

const BASELINE = "tests/cost/baseline.json";
const LAST_RUN = "tests/cost/last-run.md";
const BIG = "botez-sofia";
const PROTECTED = seedEvent("maria-andrei");

const measured: Measured = {};

/**
 * The app copy's counts, waiting for work a page does after it is sent
 * (`after()`: the guest list's recount): collected until a short wait brings
 * no more, so it counts with the page that caused it.
 */
async function settled(): Promise<DbCount> {
  const total = { ...NO_DB_COUNT };
  for (;;) {
    const count = await appDbCount();
    const keys = Object.keys(total) as (keyof DbCount)[];
    for (const key of keys) total[key] += count[key];
    if (keys.every((key) => count[key] === 0)) return total;
    await sleep(300);
  }
}

/** A page of the app copy; the count before it is already settled. */
async function fromApp(name: string, path: string, cookie?: string) {
  await page(path, cookie);
  measured[name] = await settled();
}

/** A save in this process. */
async function here(name: string, call: () => Promise<unknown>) {
  takeDbCount();
  await call();
  measured[name] = takeDbCount();
}

beforeAll(async () => {
  countDbUse(db, auth);
  /*
   * Its seed card has no template (the guest page and the editors need one),
   * and its replies already reach the cap: 150 expected, the spec's big event.
   */
  await db
    .doc(paths.event(BIG))
    .update({ templateId: "wolf-dance", expectedGuests: 150 });
});

test("what each page and save costs, against the baseline", async () => {
  const host = await hostCookie(SEED_HOST);
  const { slug } = PROTECTED.event;
  const unlock = unlockHeader(PROTECTED);

  /* Pages first: the saves below change the event. */
  await settled();
  await fromApp("page: landing (signed in)", "/", host);
  await fromApp("page: dashboard home", "/dashboard", host);
  await fromApp("page: event overview", `/dashboard/events/${BIG}`, host);
  await fromApp("page: guest list", `/dashboard/events/${BIG}/guests`, host);
  await fromApp("page: event editor", `/dashboard/events/${BIG}/details`, host);
  await fromApp("page: invitation editor", `/invitations/${BIG}`, host);
  await fromApp("page: print", `/prints/${BIG}`, host);
  await fromApp("guest: public invitation", `/${BIG}`);
  await fromApp("guest: protected, locked", `/${slug}`);
  await fromApp("guest: protected, unlocked", `/${slug}`, unlock);

  const { event, replies, list } = await readEvent(BIG);
  const now = new Date();
  await here("save: event settings", () =>
    writeEventSettings(
      SEED_HOST.uid,
      BIG,
      eventSettingsSchema.parse({ ...event, title: `${event.title} ·` }),
      now,
    ),
  );
  await here("save: invitation", () =>
    writeInvitation(SEED_HOST.uid, BIG, async () => ({
      kind: "simple",
      values: { title1: "Cost check" },
      envelope: true,
      version: 0,
    })),
  );
  const edited = fromGuestReplies(toGuestReplies([replies[0]]), [])[0];
  edited.status = edited.status === "going" ? "not_going" : "going";
  await here("save: guest list, one reply edited", () =>
    writeGuestChanges(
      SEED_HOST.uid,
      BIG,
      { replies: { put: [edited], remove: [] }, list: null },
      now,
    ),
  );
  /* What `markRepliesSeen` writes (a Server Action, so not callable here). */
  await here("save: mark replies seen", () =>
    db.doc(paths.user(SEED_HOST.uid)).update({ lastVisit: Timestamp.now() }),
  );

  const reply = (name: string) =>
    writeGuestReply(BIG, BIG, guestInput([name]), newVisitor(), now);
  await here("guest reply: new name", () => reply("Cost Check Newcomer"));
  await here("guest reply: name already replied", () =>
    reply(replies[1].people[0].name),
  );
  await here("guest reply: pre-loaded name", () => reply(list[0].name));

  const baseline: Measured | undefined = existsSync(BASELINE)
    ? JSON.parse(readFileSync(BASELINE, "utf8"))
    : undefined;
  writeFileSync(
    LAST_RUN,
    `${table(measured, baseline)}\n\n${monthInWords(month(measured))}\n`,
  );
  if (process.env.COST_UPDATE === "1") {
    writeFileSync(BASELINE, `${JSON.stringify(measured, null, 2)}\n`);
    return;
  }
  if (!baseline) {
    throw new Error("No baseline yet: `COST_UPDATE=1 npm run cost`");
  }
  expect(compare(measured, baseline), "costs that went up").toEqual([]);
}, 120_000);
