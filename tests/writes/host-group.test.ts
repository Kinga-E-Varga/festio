import { beforeAll, expect, test } from "vitest";
import { auth, db } from "@/db/admin";
import { countDbUse, NO_DB_COUNT as NONE, takeDbCount } from "@/db/count";
import type { GuestChanges, ReplyInput } from "@/db/schemas/guest-changes";
import { DIRECT, readChangeGroup } from "@/db/writes/counts";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { setGuestListOn, writeGuestChanges } from "@/db/writes/guests";
import {
  fromGuestReplies,
  toGuestReplies,
  type EventCounts,
  type StoredReply,
} from "@/lib/guests";
import { newId } from "@/lib/id";
import type { ListName } from "@/types/guests";
import {
  createEvent,
  guestInput,
  listNames,
  newVisitor,
  NOW,
  readEvent,
  recount,
  storedCounts,
  TEST_HOST,
} from "../helpers/events";

/*
 * A host save counts only the replies its change can reach (`readChangeGroup`):
 * the people it touches, the list names it changes, and every reply tied to
 * those through a name or a host's match, until nothing new turns up.
 */

beforeAll(() => countDbUse(db, auth));

type TestEvent = Awaited<ReturnType<typeof createEvent>>;

/** Counters in their stored order: coming, notComing, needsAttention, needsAttentionNoList, waiting, seatingWarnings. */
function counts(...values: number[]): EventCounts {
  const [
    coming,
    notComing,
    needsAttention,
    needsAttentionNoList,
    waiting,
    seatingWarnings,
  ] = values;
  return {
    coming,
    notComing,
    needsAttention,
    needsAttentionNoList,
    waiting,
    seatingWarnings,
  };
}

/** The stored counters are these, and a full recount agrees. */
async function expectCounts(eventId: string, expected: EventCounts) {
  expect(await storedCounts(eventId)).toEqual(expected);
  expect(await recount(eventId)).toEqual(expected);
}

/** A new event with the list on and these names saved. */
async function withList(names: ListName[]): Promise<TestEvent> {
  const event = await createEvent({ preloaded: true });
  if (names.length > 0)
    await hostSave(event.id, { list: { names, version: 0 } });
  return event;
}

function hostSave(eventId: string, changes: Partial<GuestChanges>) {
  return writeGuestChanges(
    TEST_HOST,
    eventId,
    { replies: { put: [], remove: [] }, list: null, ...changes },
    NOW,
  );
}

/* Each guest reply a minute after the last, so they keep the order sent. */
let minute = 0;

/** A guest's reply, going; returns its card's ID. */
async function guest(event: TestEvent, names: string[]): Promise<string> {
  const input = guestInput(names, "going");
  const at = new Date(NOW.getTime() + ++minute * 60_000);
  await writeGuestReply(event.id, event.doc.slug, input, newVisitor(), at);
  return input.id;
}

/** A stored reply as the guest list page sends it back. */
async function asInput(eventId: string, replyId: string): Promise<ReplyInput> {
  return fromGuestReplies(
    toGuestReplies([await stored(eventId, replyId)]),
    [],
  )[0];
}

async function stored(eventId: string, replyId: string): Promise<StoredReply> {
  const { replies } = await readEvent(eventId);
  const reply = replies.find((card) => card.id === replyId);
  if (!reply) throw new Error(`No reply ${replyId}`);
  return reply;
}

/** Saves one reply after `edit` changes it. */
async function editReply(
  eventId: string,
  replyId: string,
  edit: (reply: ReplyInput) => void,
) {
  const reply = await asInput(eventId, replyId);
  edit(reply);
  await hostSave(eventId, { replies: { put: [reply], remove: [] } });
}

async function dataVersion(eventId: string): Promise<number> {
  return (await readEvent(eventId)).event.dataVersion;
}

test("rename Anna Pop to Ana Pop", async () => {
  const event = await withList(listNames(["Ana Pop"]));
  const first = await guest(event, ["Anna Pop"]);
  await guest(event, ["Ana Pop"]);
  await editReply(event.id, first, (reply) => {
    reply.people[0].name = "Ana Pop";
  });
  await expectCounts(event.id, counts(2, 0, 2, 2, 0, 0));
});

/** Robert and Bob on the list; two Bobs replied, the first matched to Robert, the second a different person. */
async function bobAndRobert() {
  const [robert, bob] = listNames(["Robert", "Bob"]);
  const event = await withList([robert, bob]);
  const first = await guest(event, ["Bob"]);
  await editReply(event.id, first, (reply) => {
    reply.people[0].listNameId = robert.id;
  });
  const second = await guest(event, ["Bob"]);
  await editReply(event.id, second, (reply) => {
    reply.people[0].differentPerson = true;
  });
  return { event, robert, bob, first, second };
}

test("bob-robert: removing a matched list name", async () => {
  const { event, bob } = await bobAndRobert();
  await expectCounts(event.id, counts(2, 0, 0, 0, 0, 0));

  await hostSave(event.id, { list: { names: [bob], version: 1 } });
  await expectCounts(event.id, counts(2, 0, 1, 0, 0, 0));
});

test("deleting the first of two same-name replies", async () => {
  const event = await withList(listNames(["Ana Pop"]));
  const first = await guest(event, ["Ana Pop"]);
  await guest(event, ["Ana Pop"]);
  await expectCounts(event.id, counts(2, 0, 2, 2, 0, 0));

  await hostSave(event.id, { replies: { put: [], remove: [first] } });
  await expectCounts(event.id, counts(1, 0, 0, 0, 0, 0));
});

test("adding names claims an unknown reply", async () => {
  const event = await withList([]);
  await guest(event, ["Dan Stan"]);
  await expectCounts(event.id, counts(1, 0, 1, 0, 0, 0));

  await hostSave(event.id, {
    list: { names: listNames(["Dan Stan", "Elena Toma"]), version: 0 },
  });
  await expectCounts(event.id, counts(1, 0, 0, 0, 1, 0));
});

test("separate keeps the counters and the sent time", async () => {
  const event = await withList(listNames(["Ana Pop", "Ion Rusu"]));
  const first = await guest(event, ["Ana Pop", "Ion Rusu"]);
  await expectCounts(event.id, counts(2, 0, 0, 0, 0, 0));

  const source = await asInput(event.id, first);
  const moved = source.people.splice(1, 1);
  const split: ReplyInput = {
    ...source,
    id: newId(),
    isNew: true,
    from: first,
    people: moved,
  };
  await hostSave(event.id, { replies: { put: [source, split], remove: [] } });
  await expectCounts(event.id, counts(2, 0, 0, 0, 0, 0));
  const [was, now] = await Promise.all([
    stored(event.id, first),
    stored(event.id, split.id),
  ]);
  expect(now.sentAt).toEqual(was.sentAt);
});

test("marking sent changes nothing and reads two cards", async () => {
  const [ana] = listNames(["Ana Pop"]);
  const event = await withList([ana]);
  await guest(event, ["Ana Pop"]);
  const before = await readEvent(event.id);

  takeDbCount();
  await hostSave(event.id, {
    list: { names: [{ ...ana, sent: true }], version: 1 },
  });
  expect(takeDbCount()).toEqual({ ...NONE, reads: 2, writes: 1 });

  const after = await readEvent(event.id);
  expect(after.event.counts).toEqual(before.event.counts);
  expect(after.event.dataVersion).toBe(before.event.dataVersion);
  await expectCounts(event.id, counts(1, 0, 0, 0, 0, 0));
});

test("editing one reply reads only its group", async () => {
  const names = Array.from({ length: 40 }, (_, at) => `Guest ${at + 1}`);
  const event = await withList(listNames(names.slice(0, 10)));
  const ids: string[] = [];
  for (const name of names) ids.push(await guest(event, [name]));
  const reply = await asInput(event.id, ids[4]);
  reply.status = "not_going";

  takeDbCount();
  await hostSave(event.id, { replies: { put: [reply], remove: [] } });
  expect(takeDbCount().reads).toBeLessThanOrEqual(8);
  await expectCounts(event.id, counts(39, 1, 30, 0, 0, 0));
});

test("dataVersion goes up with replies and names, not with sent", async () => {
  const [ana] = listNames(["Ana Pop"]);
  const event = await withList([ana]);
  const start = await dataVersion(event.id);

  const reply = await guest(event, ["Ana Pop"]);
  expect(await dataVersion(event.id)).toBe(start + 1);

  await editReply(event.id, reply, (input) => {
    input.status = "not_going";
  });
  expect(await dataVersion(event.id)).toBe(start + 2);

  await hostSave(event.id, {
    list: { names: [{ ...ana, name: "Ana Popa" }], version: 1 },
  });
  expect(await dataVersion(event.id)).toBe(start + 3);

  await hostSave(event.id, {
    list: { names: [{ ...ana, name: "Ana Popa", sent: true }], version: 2 },
  });
  expect(await dataVersion(event.id)).toBe(start + 3);

  await setGuestListOn(TEST_HOST, event.id, false);
  expect(await dataVersion(event.id)).toBe(start + 3);
  await expectCounts(event.id, counts(0, 1, 1, 0, 1, 0));
});

test("a host save returns the event's dataVersion after it", async () => {
  const [ana] = listNames(["Ana Pop"]);
  const event = await withList([ana]);
  const reply = await guest(event, ["Ana Pop"]);
  const start = await dataVersion(event.id);

  const card = await asInput(event.id, reply);
  card.status = "not_going";
  const edited = await hostSave(event.id, {
    replies: { put: [card], remove: [] },
  });
  expect(edited.dataVersion).toBe(start + 1);
  expect(edited.dataVersion).toBe(await dataVersion(event.id));

  const sent = await hostSave(event.id, {
    list: { names: [{ ...ana, sent: true }], version: 1 },
  });
  expect(sent.dataVersion).toBe(start + 1);
  expect(sent.dataVersion).toBe(await dataVersion(event.id));
});

test("the group gives up past its round limit", async () => {
  const { event, robert, bob, first, second } = await bobAndRobert();
  const list = [robert, bob];

  expect(
    await readChangeGroup(DIRECT, event.id, ["robert"], [list], {
      rounds: 1,
      names: 300,
    }),
  ).toBeNull();

  const group = await readChangeGroup(DIRECT, event.id, ["robert"], [list], {
    rounds: 3,
    names: 300,
  });
  expect(group?.map((reply) => reply.id)).toEqual([first, second]);
});

test("a chain of matches past the round limit counts every reply", async () => {
  const [bea, cara, dora, ema] = listNames(["Bea", "Cara", "Dora", "Ema"]);
  const event = await withList([bea, cara, dora, ema]);
  /* Each reply matched to the next one's name: Ana → Bea → Cara → Dora → Ema. */
  const chain: [string, ListName][] = [
    ["Ana", bea],
    ["Bea", cara],
    ["Cara", dora],
    ["Dora", ema],
  ];
  const ids: string[] = [];
  for (const [name, match] of chain) {
    const id = await guest(event, [name]);
    await editReply(event.id, id, (reply) => {
      reply.people[0].listNameId = match.id;
    });
    ids.push(id);
  }
  await expectCounts(event.id, counts(4, 0, 0, 0, 0, 0));
  /* Ana's edit touches Ana and Bea; the group grows a name a round and never settles: the save recounts. */
  expect(
    await readChangeGroup(
      DIRECT,
      event.id,
      ["ana", "bea"],
      [[bea, cara, dora, ema]],
    ),
  ).toBeNull();

  await editReply(event.id, ids[0], (reply) => {
    reply.status = "not_going";
  });
  await expectCounts(event.id, counts(3, 1, 0, 0, 0, 0));
});
