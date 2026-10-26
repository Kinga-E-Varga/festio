import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import {
  eventSettingsSchema,
  type EventDoc,
  type EventSettings,
} from "@/db/schemas/event";
import type { GuestChanges } from "@/db/schemas/guest-changes";
import { writeEventSettings } from "@/db/writes/event";
import { writeGuestChanges } from "@/db/writes/guests";
import { writeInvitation } from "@/db/writes/invitation";
import { createEvent, NOW, refusedWith, TEST_HOST } from "../helpers/events";

/** What Event settings sends for this card, from the version it read: the form's own fields only. */
function settingsOf(doc: EventDoc, version = doc.version): EventSettings {
  return eventSettingsSchema.parse({ ...doc, version });
}

test("event settings saved from an old version are refused", async () => {
  const { id, doc } = await createEvent();
  const first = { ...settingsOf(doc, 0), title: "First device" };
  const second = { ...settingsOf(doc, 0), title: "Second device" };
  expect(await writeEventSettings(TEST_HOST, id, first, NOW)).toEqual({
    version: 1,
  });
  expect(
    await refusedWith(writeEventSettings(TEST_HOST, id, second, NOW)),
  ).toBe("stale");
  const stored = (await db.doc(paths.event(id)).get()).data();
  expect(stored?.title).toBe("First device");
});

test("an invitation saved from an old version is refused", async () => {
  const { id } = await createEvent();
  const save = (title: string) =>
    refusedWith(
      writeInvitation(TEST_HOST, id, async () => ({
        kind: "simple",
        values: { title },
        envelope: true,
        opening: "slide",
        version: 0,
      })),
    );
  expect(await save("First device")).toBe("ok");
  expect(await save("Second device")).toBe("stale");
});

test("a guest list saved from an old version is refused", async () => {
  const { id } = await createEvent({ preloaded: true });
  const changes = (name: string): GuestChanges => ({
    replies: { put: [], remove: [] },
    list: { names: [{ id: "n1", name, sent: false }], version: 0 },
  });
  expect(
    await writeGuestChanges(TEST_HOST, id, changes("Ana"), NOW),
  ).toMatchObject({
    listVersion: 1,
  });
  expect(
    await refusedWith(writeGuestChanges(TEST_HOST, id, changes("Ion"), NOW)),
  ).toBe("stale");
});

test("another host's event answers not found", async () => {
  const { id, doc } = await createEvent();
  expect(
    await refusedWith(
      writeEventSettings("someone-else", id, settingsOf(doc), NOW),
    ),
  ).toBe("notFound");
});

test("the date can't move from the event day on, on the event's clock", async () => {
  /* Auckland is UTC+13 in January; the server (New York) is still on 10 January for both. */
  const event = { date: "2029-01-11", timeZone: "Pacific/Auckland" };
  /** A new event, its date moved at `now`. */
  const moveDate = async (now: Date) => {
    const { id, doc } = await createEvent(event);
    const moved = { ...settingsOf(doc), date: "2029-02-01" };
    return refusedWith(writeEventSettings(TEST_HOST, id, moved, now));
  };
  expect(await moveDate(new Date("2029-01-10T10:00:00Z"))).toBe("ok");
  expect(await moveDate(new Date("2029-01-10T11:00:00Z"))).toBe("dateLocked");
});
