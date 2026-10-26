import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { invitationSchema } from "@/db/schemas/invitation";
import { writeInvitation } from "@/db/writes/invitation";
import { createEvent, TEST_HOST } from "../helpers/events";

/** The invitation card as the pages read it. */
async function readCard(eventId: string) {
  const snap = await db.doc(paths.invitation(eventId)).get();
  return invitationSchema.parse(snap.data());
}

test("a simple card saved with the card rising keeps it", async () => {
  const { id } = await createEvent();
  await writeInvitation(TEST_HOST, id, async () => ({
    kind: "simple",
    values: {},
    envelope: true,
    opening: "rise",
    version: 0,
  }));

  const card = await readCard(id);
  expect(card.kind === "simple" && card.opening).toBe("rise");
});

test("a simple card saved before the choice existed slides out", async () => {
  const { id } = await createEvent();
  await db.doc(paths.invitation(id)).set({
    kind: "simple",
    values: {},
    envelope: true,
    version: 1,
  });

  const card = await readCard(id);
  expect(card.kind === "simple" && card.opening).toBe("slide");
});
