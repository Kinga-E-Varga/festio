import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { writeInvitation } from "@/db/writes/invitation";
import { createEvent, TEST_HOST } from "../helpers/events";

/** The event card's `invitationVersion` and the invitation card's `version`, as stored. */
async function versions(eventId: string) {
  const [event, invitation] = await Promise.all([
    db.doc(paths.event(eventId)).get(),
    db.doc(paths.invitation(eventId)).get(),
  ]);
  return {
    event: event.data()?.invitationVersion,
    invitation: invitation.data()?.version,
  };
}

test("saving the invitation raises the event card's invitationVersion", async () => {
  const { id } = await createEvent();
  const save = (version: number) =>
    writeInvitation(TEST_HOST, id, async () => ({
      kind: "simple",
      values: { title1: `Saved from ${version}` },
      envelope: true,
      version,
    }));

  expect((await versions(id)).event).toBe(0);
  await save(0);
  expect(await versions(id)).toEqual({ event: 1, invitation: 1 });
  await save(1);
  expect(await versions(id)).toEqual({ event: 2, invitation: 2 });
});
