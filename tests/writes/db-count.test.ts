import { beforeAll, expect, test } from "vitest";
import { auth, db } from "@/db/admin";
import { countDbUse, NO_DB_COUNT as NONE, takeDbCount } from "@/db/count";
import { newId } from "@/lib/id";

/* The counter against Firestore's billing rules, as `src/db/count.ts` lists them. */

beforeAll(() => countDbUse(db, auth));

/** A folder of its own with `count` cards in it, written before counting starts. */
async function folder(count: number) {
  const cards = db.collection(`countTest/${newId()}/cards`);
  await Promise.all(
    Array.from({ length: count }, (_, i) => cards.doc(`c${i}`).set({ i })),
  );
  takeDbCount();
  return cards;
}

test("a document read is one read", async () => {
  const cards = await folder(1);
  await cards.doc("c0").get();
  expect(takeDbCount()).toEqual({ ...NONE, reads: 1 });
});

test("a missing document still costs a read", async () => {
  const cards = await folder(0);
  await cards.doc("nobody").get();
  expect(takeDbCount()).toEqual({ ...NONE, reads: 1 });
});

test("a query costs one read per card", async () => {
  const cards = await folder(3);
  await cards.get();
  expect(takeDbCount()).toEqual({ ...NONE, reads: 3 });
});

test("an empty query costs one read", async () => {
  const cards = await folder(0);
  await cards.get();
  expect(takeDbCount()).toEqual({ ...NONE, reads: 1 });
});

test("a count costs one read", async () => {
  const cards = await folder(3);
  await cards.count().get();
  expect(takeDbCount()).toEqual({ ...NONE, reads: 1 });
});

test("getAll costs one read per card", async () => {
  const cards = await folder(2);
  await db.getAll(cards.doc("c0"), cards.doc("c1"));
  expect(takeDbCount()).toEqual({ ...NONE, reads: 2 });
});

test("a transaction's reads count", async () => {
  const cards = await folder(2);
  await db.runTransaction(async (tx) => {
    await tx.get(cards.doc("c0"));
    await tx.get(cards);
    await tx.getAll(cards.doc("c0"), cards.doc("c1"));
  });
  expect(takeDbCount()).toEqual({ ...NONE, reads: 5 });
});

test("writes count per card", async () => {
  const cards = await folder(0);
  await cards.doc("a").set({ n: 1 });
  expect(takeDbCount()).toEqual({ ...NONE, writes: 1 });

  const batch = db.batch();
  batch.set(cards.doc("b"), { n: 1 });
  batch.update(cards.doc("a"), { n: 2 });
  batch.delete(cards.doc("b"));
  await batch.commit();
  expect(takeDbCount()).toEqual({ ...NONE, writes: 3 });

  await db.runTransaction(async (tx) => {
    tx.set(cards.doc("c"), { n: 1 });
    tx.update(cards.doc("a"), { n: 3 });
  });
  expect(takeDbCount()).toEqual({ ...NONE, writes: 2 });
});

test("a session check is counted", async () => {
  takeDbCount();
  await auth.verifySessionCookie("not-a-cookie", true).catch(() => null);
  expect(takeDbCount()).toEqual({ ...NONE, authChecks: 1 });
});

/** Reads a query by `stream()`, to its end. */
async function streamAll(query: FirebaseFirestore.Query): Promise<void> {
  for await (const card of query.stream()) void card;
}

test("a streamed query costs one read per card, at least one", async () => {
  const three = await folder(3);
  await streamAll(three);
  expect(takeDbCount()).toEqual({ ...NONE, reads: 3 });

  const none = await folder(0);
  await streamAll(none);
  expect(takeDbCount()).toEqual({ ...NONE, reads: 1 });
});

test("a recursive delete counts what it lists and deletes", async () => {
  const cards = await folder(2);
  await db.recursiveDelete(cards);
  expect(takeDbCount()).toEqual({ ...NONE, reads: 2, writes: 2 });
});
