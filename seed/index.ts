import { Timestamp, type BulkWriter } from "firebase-admin/firestore";
import { auth, db, USE_EMULATORS } from "@/db/admin";
import { paths } from "@/db/paths";
import { eventSchema, type EventDoc } from "@/db/schemas/event";
import { guestListNameSchema } from "@/db/schemas/guest-list";
import { invitationSchema } from "@/db/schemas/invitation";
import { paymentSchema, type PaymentDoc } from "@/db/schemas/payment";
import { replySchema } from "@/db/schemas/reply";
import { seatingSchema, type SeatingDoc } from "@/db/schemas/seating";
import { slugDocSchema } from "@/db/schemas/slug";
import { userSchema } from "@/db/schemas/user";
import { SLUG_BLOCK_DAYS, TERMS_VERSION } from "@/lib/config";
import { addDays, deletionDate } from "@/lib/event";
import { buildRows, countRows, toGuestReplies } from "@/lib/guests";
import { momentFromNow } from "./build";
import { SEED_EVENTS, type SeedEvent } from "./events";

/*
 * Wipes the local emulators and fills them with the seed: one host, the
 * events with their replies, guest lists, invitations and seating, plus
 * slugs and payments. Every card is checked against its schema first.
 *
 * `npm run emulators` runs it on start; `npm run seed` resets the data any
 * time. `--stay` keeps it running, so the emulators stay up until Ctrl+C.
 */

const HOST = {
  uid: "host-maria",
  email: "maria@festio.test",
  password: "festio-dev",
  name: "Maria",
};

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

/** Never touch a real project: the seed deletes everything first. */
function checkEmulators() {
  if (!USE_EMULATORS || !PROJECT?.startsWith("demo-")) {
    throw new Error("The seed only runs against the local emulators.");
  }
}

/**
 * Empties Firestore and Auth through the emulators' own reset endpoints, at
 * the addresses `@/db/admin` pointed the SDK at.
 */
async function clear() {
  const { FIRESTORE_EMULATOR_HOST, FIREBASE_AUTH_EMULATOR_HOST } = process.env;
  const resets = [
    `http://${FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`,
    `http://${FIREBASE_AUTH_EMULATOR_HOST}/emulator/v1/projects/${PROJECT}/accounts`,
  ];
  await Promise.all(
    resets.map(async (url) => {
      const response = await fetch(url, { method: "DELETE" });
      if (!response.ok) throw new Error(`Reset failed: ${url}`);
    }),
  );
}

/** The counters, worked out the way the guest list page will recount them. */
function counts(seed: SeedEvent): EventDoc["counts"] {
  const people = toGuestReplies(seed.replies);
  const rows = buildRows(
    { list: seed.guestList, replies: people, questions: seed.event.questions },
    seed.event.preloaded,
  );
  const { going, notGoing, attention } = countRows(rows);
  const coming = new Set(
    people.filter((person) => person.status === "going").map(({ id }) => id),
  );
  const seats = Object.keys(seed.seating?.seats ?? {});
  return {
    coming: going,
    notComing: notGoing,
    needsAttention: attention,
    /* Seated but not coming (or gone). */
    seatingWarnings: seats.filter((id) => !coming.has(id)).length,
  };
}

/** A seat keeps a copy of the person's name at save time. */
function seating(seed: SeedEvent): SeatingDoc | undefined {
  if (!seed.seating) return undefined;
  const names = new Map(
    [...seed.replies.flatMap((reply) => reply.people), ...seed.guestList].map(
      (person) => [person.id, person.name],
    ),
  );
  const seats = Object.fromEntries(
    Object.entries(seed.seating.seats).map(([id, table]) => [
      id,
      { table, name: names.get(id) },
    ]),
  );
  return seatingSchema.parse({ ...seed.seating, seats });
}

const PRODUCTS = {
  standard: { product: "freeToStandard", amount: 10000 },
  custom: { product: "freeToCustom", amount: 20000 },
} as const;

function payment(seed: SeedEvent): PaymentDoc | undefined {
  if (seed.event.package === "free") return undefined;
  return paymentSchema.parse({
    hostId: HOST.uid,
    eventId: seed.id,
    ...PRODUCTS[seed.event.package],
    currency: "RON",
    date: momentFromNow(-30),
    orderId: `seed-${seed.id}`,
    status: "paid",
  });
}

/** A deleted event's link stays blocked for a while after its data went. */
function slugCard(seed: SeedEvent) {
  return slugDocSchema.parse({
    eventId: seed.id,
    ...(seed.event.dataDeleted && {
      blockedUntil: Timestamp.fromDate(
        addDays(deletionDate(seed.event.date), SLUG_BLOCK_DAYS),
      ),
    }),
  });
}

async function seedHost(writer: BulkWriter) {
  await auth.createUser({
    uid: HOST.uid,
    email: HOST.email,
    password: HOST.password,
    displayName: HOST.name,
    /* Verified, so trying Google on this email adds Google instead of replacing the password. */
    emailVerified: true,
  });
  const user = userSchema.parse({
    name: HOST.name,
    language: "en",
    joinedAt: momentFromNow(-120),
    terms: { version: TERMS_VERSION, acceptedAt: momentFromNow(-120) },
  });
  writer.set(db.doc(paths.user(HOST.uid)), user);
}

function seedEvent(writer: BulkWriter, seed: SeedEvent) {
  const event = eventSchema.parse({
    ...seed.event,
    hostId: HOST.uid,
    counts: counts(seed),
    version: 0,
    createdAt: momentFromNow(-60),
  });
  writer.set(db.doc(paths.event(seed.id)), event);
  writer.set(db.doc(paths.slug(event.slug)), slugCard(seed));

  if (seed.invitation) {
    const invitation = invitationSchema.parse(seed.invitation);
    writer.set(db.doc(paths.invitation(seed.id)), invitation);
  }
  for (const { id, ...reply } of seed.replies) {
    writer.set(
      db.doc(`${paths.replies(seed.id)}/${id}`),
      replySchema.parse(reply),
    );
  }
  for (const { id, ...name } of seed.guestList) {
    const card = guestListNameSchema.parse({ ...name, version: 0 });
    writer.set(db.doc(`${paths.guestList(seed.id)}/${id}`), card);
  }
  const chart = seating(seed);
  if (chart) writer.set(db.doc(paths.seating(seed.id)), chart);
  const paid = payment(seed);
  if (paid) writer.set(db.collection(paths.payments).doc(), paid);
}

async function main() {
  checkEmulators();
  await clear();
  const writer = db.bulkWriter();
  await seedHost(writer);
  for (const seed of SEED_EVENTS) seedEvent(writer, seed);
  await writer.close();
  console.log(
    `Seeded ${SEED_EVENTS.length} events. Host login: ${HOST.email} / ${HOST.password}`,
  );
  if (process.argv.includes("--stay")) {
    console.log("Emulators running: http://127.0.0.1:4000 — Ctrl+C to stop.");
    /* A timer keeps Node alive; a bare pending promise doesn't. */
    setInterval(() => {}, 60_000);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
