import { Timestamp } from "firebase-admin/firestore";
import { beforeAll, expect, test } from "vitest";
import { auth, db } from "@/db/admin";
import { countDbUse, NO_DB_COUNT, takeDbCount } from "@/db/count";
import { paths } from "@/db/paths";
import type { ReplyDoc } from "@/db/schemas/reply";
import { feedTags, latestReplies } from "@/db/reads/feed";
import { replyRef } from "@/db/writes/reply-ref";
import type { StoredReply } from "@/lib/guests";
import { newId } from "@/lib/id";
import type { ListName } from "@/types/guests";
import { createEvent } from "../helpers/events";

/*
 * The latest replies: the newest across a host's events in one query, and
 * their Unknown / Duplicate tags read from the replies sharing their names,
 * never from every reply of the event.
 */

type Person = ReplyDoc["people"][number];

beforeAll(() => countDbUse(db, auth));

/** A reply card sent `minute` minutes into the day, written as every write is. */
async function addReply(
  eventId: string,
  hostId: string,
  minute: number,
  people: (string | Partial<Person>)[],
  id = newId(),
): Promise<StoredReply> {
  const card: ReplyDoc = {
    sentAt: Timestamp.fromDate(new Date(Date.UTC(2029, 0, 10, 0, minute))),
    status: "going",
    message: null,
    createdBy: "guest",
    people: people.map((person) =>
      typeof person === "string"
        ? { id: newId(), name: person }
        : { id: newId(), name: "", ...person },
    ),
  };
  await replyRef(eventId, id, hostId).set(card);
  return { ...card, id };
}

function listName(name: string): ListName {
  return { id: newId(), name, sent: false };
}

async function saveList(eventId: string, names: ListName[]) {
  await db.doc(paths.guestList(eventId)).set({ names, version: 1 });
}

/** The replies' event and sent minute, as read back. */
function shape(replies: { eventId: string; reply: StoredReply }[]) {
  return replies.map(({ eventId, reply }) => [
    eventId,
    reply.sentAt.toDate().getUTCMinutes(),
  ]);
}

test("the newest replies across one host's events, newest first, no one else's", async () => {
  const host = newId();
  const [first, second, other] = await Promise.all([
    createEvent({ hostId: host }),
    createEvent({ hostId: host }),
    createEvent({ hostId: newId() }),
  ]);
  for (const minute of [1, 3, 5]) await addReply(first.id, host, minute, ["A"]);
  for (const minute of [2, 4]) await addReply(second.id, host, minute, ["B"]);
  await addReply(other.id, "someone-else", 6, ["C"]);

  expect(shape(await latestReplies({ hostId: host }, 3))).toEqual([
    [first.id, 5],
    [second.id, 4],
    [first.id, 3],
  ]);
  expect(shape(await latestReplies({ eventId: second.id }, 5))).toEqual([
    [second.id, 4],
    [second.id, 2],
  ]);
});

test("tags come from the replies sharing a name, with the list on", async () => {
  const host = newId();
  const event = await createEvent({ hostId: host, preloaded: true });
  const ana = listName("Ana Pop");
  const ion = listName("Ion Rusu");
  await saveList(event.id, [ana, ion, listName("Dan Stan")]);

  /* Claims Ana Pop. */
  const first = await addReply(event.id, host, 1, ["Ana Pop"]);
  /* The first's name again: Duplicate. Not Unknown too: that waits until the host tells the two apart. */
  const second = await addReply(event.id, host, 2, ["ana pop"]);
  const maria = await addReply(event.id, host, 3, ["Maria Ilie"]);
  /* Its name went to the host's match below: Unknown. */
  const ionReply = await addReply(event.id, host, 4, ["Ion Rusu"]);
  const matched = await addReply(event.id, host, 5, [
    { name: "Ioan Rusu", listNameId: ion.id },
  ]);
  /* Dan Stan is on the list, Elena Toma isn't. */
  const pair = await addReply(event.id, host, 6, ["Dan Stan", "Elena Toma"]);
  /* Told apart from Ana Pop, whose name is taken: Unknown. */
  const apart = await addReply(event.id, host, 7, [
    { name: "Ana Pop", differentPerson: true },
  ]);

  const all = [first, second, maria, ionReply, matched, pair, apart];
  const tags = await feedTags(event.id, true, all);
  expect(all.map((reply) => tags.get(reply.id))).toEqual([
    [],
    ["duplicate"],
    ["unknown"],
    ["unknown"],
    [],
    ["unknown"],
    ["unknown"],
  ]);

  /* Shown alone, they still find the replies that decide their tags. */
  const shown = await feedTags(event.id, true, [ionReply, second, apart]);
  expect([ionReply, second, apart].map((reply) => shown.get(reply.id))).toEqual(
    [["unknown"], ["duplicate"], ["unknown"]],
  );
});

test("with the list off, only Duplicate", async () => {
  const host = newId();
  const event = await createEvent({ hostId: host, preloaded: false });
  await saveList(event.id, [listName("Ana Pop")]);
  const first = await addReply(event.id, host, 1, ["Ana Pop"]);
  const second = await addReply(event.id, host, 2, ["ANA POP"]);
  const maria = await addReply(event.id, host, 3, ["Maria Ilie"]);

  const tags = await feedTags(event.id, false, [second, maria]);
  expect([second, maria].map((reply) => tags.get(reply.id))).toEqual([
    ["duplicate"],
    [],
  ]);
  expect((await feedTags(event.id, false, [first])).get(first.id)).toEqual([]);
});

test("the same reply ID in two events stays with its own event", async () => {
  const host = newId();
  const [first, second] = await Promise.all([
    createEvent({ hostId: host }),
    createEvent({ hostId: host }),
  ]);
  await addReply(first.id, host, 1, ["A"], "r1");
  await addReply(second.id, host, 2, ["B"], "r1");

  expect(shape(await latestReplies({ hostId: host }, 5))).toEqual([
    [second.id, 2],
    [first.id, 1],
  ]);
});

test("more than 30 names shown at once still find their group", async () => {
  const host = newId();
  const event = await createEvent({ hostId: host });
  const names = Array.from({ length: 40 }, (_, at) => `Guest ${at + 1}`);
  await addReply(event.id, host, 1, ["Guest 31"]);
  const shown: StoredReply[] = [];
  for (let at = 0; at < 4; at += 1)
    shown.push(
      await addReply(
        event.id,
        host,
        2 + at,
        names.slice(at * 10, at * 10 + 10),
      ),
    );

  const tags = await feedTags(event.id, false, shown);
  /* Guest 31 sent a reply before: only the fourth, with guests 31 to 40, is a Duplicate. */
  expect(shown.map((reply) => tags.get(reply.id))).toEqual([
    [],
    [],
    [],
    ["duplicate"],
  ]);
});

test("replies sharing no name with the shown ones are never read", async () => {
  const host = newId();
  const event = await createEvent({ hostId: host });
  for (let minute = 1; minute <= 5; minute += 1)
    await addReply(event.id, host, minute, [`Other ${minute}`]);
  const shown = await addReply(event.id, host, 6, ["Ana Pop"]);

  takeDbCount();
  await feedTags(event.id, false, [shown]);
  /* One query, finding only the shown reply itself. */
  expect(takeDbCount()).toEqual({ ...NO_DB_COUNT, reads: 1 });
});
