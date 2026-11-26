import { expect, test } from "vitest";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { writeGuestChanges } from "@/db/writes/guests";
import { newId } from "@/lib/id";
import {
  createEvent,
  guestInput,
  newVisitor,
  NOW,
  refusedWith,
  storedCounts,
  TEST_HOST,
} from "../helpers/events";

/*
 * The reply cap stops the host too: a save that raises the event's people
 * past it is refused, edits and deletes that don't are always saved.
 * Expected 10 → cap 30 (10 + the 20 minimum extra) in every test here.
 */

interface Card {
  id: string;
  status: "going" | "not_going";
  message: null;
  people: { id: string; name: string }[];
}

/** A reply card of `count` people, with names no other card in the test has. */
function card(count: number, prefix: string): Card {
  return {
    id: newId(),
    status: "going",
    message: null,
    people: Array.from({ length: count }, (_, at) => ({
      id: newId(),
      name: `${prefix} ${at}`,
    })),
  };
}

function save(
  eventId: string,
  put: (Card & { isNew: boolean })[],
  remove: string[] = [],
) {
  return refusedWith(
    writeGuestChanges(
      TEST_HOST,
      eventId,
      { replies: { put, remove }, list: null },
      NOW,
    ),
  );
}

const added = (cards: Card[]) => cards.map((one) => ({ ...one, isNew: true }));

async function people(eventId: string): Promise<number> {
  const counts = await storedCounts(eventId);
  return counts.coming + counts.notComing;
}

test("the host can add up to the cap, not one person past it", async () => {
  const { id } = await createEvent({ expectedGuests: 10 });
  expect(
    await save(id, added([card(10, "A"), card(10, "B"), card(8, "C")])),
  ).toBe("ok");
  expect(await people(id)).toBe(28);

  expect(await save(id, added([card(3, "D")]))).toBe("full");
  expect(await people(id)).toBe(28);

  expect(await save(id, added([card(2, "E")]))).toBe("ok");
  expect(await people(id)).toBe(30);
  expect(await save(id, added([card(1, "F")]))).toBe("full");
});

test("one save with many replies can't jump past the cap", async () => {
  const { id } = await createEvent({ expectedGuests: 10 });
  const cards = [card(10, "A"), card(10, "B"), card(10, "C"), card(10, "D")];
  expect(await save(id, added(cards))).toBe("full");
  expect(await people(id)).toBe(0);
});

test("past the cap, edits and deletes are saved and make room, additions are not", async () => {
  const { id, doc } = await createEvent({ expectedGuests: 10 });
  const host = [card(10, "A"), card(10, "B"), card(8, "C")];
  expect(await save(id, added(host))).toBe("ok");
  /* A guest's family arriving under the cap is saved whole: 28 + 9 = 37. */
  const family = guestInput(
    Array.from({ length: 9 }, (_, at) => `Guest ${at}`),
  );
  expect(
    await refusedWith(writeGuestReply(id, doc.slug, family, newVisitor(), NOW)),
  ).toBe("ok");
  expect(await people(id)).toBe(37);

  /* A rename keeps 37. */
  const [first] = host;
  const renamed = {
    ...first,
    isNew: false,
    people: first.people.map((person, at) =>
      at === 0 ? { ...person, name: "Renamed" } : person,
    ),
  };
  expect(await save(id, [renamed])).toBe("ok");
  expect(await people(id)).toBe(37);

  /* One more person on an existing card: 38. */
  const bigger = {
    ...host[2],
    isNew: false,
    people: [...host[2].people, { id: newId(), name: "Extra" }],
  };
  expect(await save(id, [bigger])).toBe("full");
  expect(await people(id)).toBe(37);

  /* Deleting the 9 brings it to 28: room for 2 again. */
  expect(await save(id, [], [family.id])).toBe("ok");
  expect(await people(id)).toBe(28);
  expect(await save(id, added([card(2, "D")]))).toBe("ok");
  expect(await people(id)).toBe(30);
});

test("a save that adds and deletes is judged by what it leaves", async () => {
  const { id } = await createEvent({ expectedGuests: 10 });
  const host = [card(10, "A"), card(10, "B"), card(10, "C")];
  await save(id, added(host));
  expect(await people(id)).toBe(30);
  /* 10 off, 5 on: 25. */
  expect(await save(id, added([card(5, "D")]), [host[0].id])).toBe("ok");
  expect(await people(id)).toBe(25);
});

test("not coming counts against the cap too", async () => {
  const { id } = await createEvent({ expectedGuests: 10 });
  const away = { ...card(10, "A"), status: "not_going" as const };
  await save(id, added([card(10, "B"), card(10, "C"), away]));
  expect(await people(id)).toBe(30);
  expect(await save(id, added([card(1, "D")]))).toBe("full");
});

test("the host can add with the form closed or the invitation Hidden", async () => {
  const { id } = await createEvent({
    expectedGuests: 10,
    visibility: "hidden",
    repliesCloseAt: "2029-01-01T00:00",
  });
  expect(await save(id, added([card(5, "A")]))).toBe("ok");
  expect(await people(id)).toBe(5);
});
