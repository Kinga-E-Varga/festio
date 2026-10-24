import type { Readable } from "node:stream";
import type { Auth } from "firebase-admin/auth";
import {
  QuerySnapshot,
  Query,
  Transaction,
  WriteBatch,
  type Firestore,
} from "firebase-admin/firestore";

/*
 * Dev only: counts what the server asks of Firestore, the way Firestore bills
 * it, plus the session checks that ask Firebase Auth. Switched on by
 * `FESTIO_COUNT_DB=true` on the emulators (`src/db/admin.ts`), which only the
 * cost check and the page tests set; production never counts.
 *
 * Billing: each document fetched is a read, a missing one too; a query is a
 * read per document returned, at least one; a count is one read; each
 * document written or deleted is a write. Writes are counted when queued, not
 * when committed, so a transaction that retries counts its writes again. Not
 * counted: `listDocuments`, which Festio doesn't use.
 */

export interface DbCount {
  reads: number;
  writes: number;
  authChecks: number;
}

export const NO_DB_COUNT: Readonly<DbCount> = {
  reads: 0,
  writes: 0,
  authChecks: 0,
};

/*
 * One tally for the whole process. The app's build can bundle this module
 * more than once (the page tests' copy has two); every copy counts here.
 */
const STORE = Symbol.for("festio.dbCount");
const store = globalThis as { [STORE]?: DbCount };
const counted = (store[STORE] ??= { ...NO_DB_COUNT });

/** The counts since the last take, then zero again. */
export function takeDbCount(): DbCount {
  const taken = { ...counted };
  Object.assign(counted, NO_DB_COUNT);
  return taken;
}

/** Marks a method already counting, so no copy wraps it twice. */
const WRAPPED = Symbol.for("festio.dbCount.wrapped");
type Method = ((...args: unknown[]) => unknown) & { [WRAPPED]?: true };

/** Replaces `name` on `target` with the same method that also counts its result. */
function wrap(
  target: object,
  name: string,
  count: (result: unknown) => void,
): void {
  const methods = target as Record<string, Method>;
  const original = methods[name];
  if (original[WRAPPED]) return;
  const counting: Method = function (this: unknown, ...args: unknown[]) {
    const result = original.apply(this, args);
    if (result instanceof Promise) {
      return result.then((value: unknown) => {
        count(value);
        return value;
      });
    }
    count(result);
    return result;
  };
  counting[WRAPPED] = true;
  methods[name] = counting;
}

/** Reads a fetch costs: a query's cards (at least one), else one. */
function readsOf(result: unknown): number {
  return result instanceof QuerySnapshot ? Math.max(1, result.size) : 1;
}

const addReads = (reads: number) => (counted.reads += reads);
const addAll = (result: unknown) => addReads((result as unknown[]).length);
const addWrite = () => (counted.writes += 1);

/**
 * A streamed query's reads, one per card and at least one, counted from its
 * events as they pass: listening would change how the caller reads it.
 */
function countStream(stream: Readable): void {
  let cards = 0;
  const emit = stream.emit.bind(stream);
  stream.emit = (event: string | symbol, ...args: unknown[]) => {
    if (event === "data") cards += 1;
    if (event === "end") addReads(Math.max(1, cards));
    return emit(event, ...args);
  };
}

/**
 * Counts every read and write from here on, for the whole process. The
 * transaction's own reads skip `Firestore.getAll`, so it is wrapped too;
 * every write, a transaction's or a single card's, goes through a
 * `WriteBatch`. Takes the instances, as `@/db/admin` calls it while loading.
 */
export function countDbUse(firestore: Firestore, auth: Auth): void {
  wrap(Object.getPrototypeOf(firestore), "getAll", addAll);
  wrap(Query.prototype, "get", (result) => addReads(readsOf(result)));
  /* `recursiveDelete` lists what it deletes this way. */
  wrap(Query.prototype, "stream", (result) => countStream(result as Readable));
  /* A count query's class isn't exported: one is made, never run, to reach it. */
  wrap(
    Object.getPrototypeOf(firestore.collection("count").count()),
    "get",
    () => addReads(1),
  );
  wrap(Transaction.prototype, "get", (result) => addReads(readsOf(result)));
  wrap(Transaction.prototype, "getAll", addAll);
  for (const name of ["create", "set", "update", "delete"]) {
    wrap(WriteBatch.prototype, name, addWrite);
  }
  /* Counted when asked, not answered: a rejected cookie still asked Firebase. */
  const verify = auth.verifySessionCookie as Method;
  if (verify[WRAPPED]) return;
  const checking: Method = (...args) => {
    counted.authChecks += 1;
    return verify.apply(auth, args);
  };
  checking[WRAPPED] = true;
  auth.verifySessionCookie = checking as typeof auth.verifySessionCookie;
}
