import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import {
  eventSchema,
  eventSettingsSchema,
  type EventDoc,
} from "@/db/schemas/event";
import { writeEventSettings } from "@/db/writes/event";
import { createEvent, NOW, refusedWith, TEST_HOST } from "../helpers/events";

/*
 * Spec (`subdomain-links.md`): adding a name to the reserved subdomains only
 * blocks new links, never ones already taken.
 */

/** Event settings as the form sends them, version as read. */
function settingsOf(doc: EventDoc) {
  return eventSettingsSchema.parse(doc);
}

test("an event keeps a link that was reserved after it took it", async () => {
  /* "official" is reserved now; this event took it before. */
  const { id, doc } = await createEvent({ slug: "official" });
  const card = await db.doc(paths.event(id)).get();
  expect(eventSchema.safeParse(card.data()).success).toBe(true);
  expect(
    await refusedWith(
      writeEventSettings(
        TEST_HOST,
        id,
        { ...settingsOf(doc), title: "Renamed" },
        NOW,
      ),
    ),
  ).toBe("ok");
});

test("a reserved link can't be taken", async () => {
  const { id, doc } = await createEvent();
  expect(
    await refusedWith(
      writeEventSettings(
        TEST_HOST,
        id,
        { ...settingsOf(doc), slug: "billing" },
        NOW,
      ),
    ),
  ).toBe("invalid");
});
