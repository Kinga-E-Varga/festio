import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import type { GuestReplyInput } from "@/db/schemas/reply";
import { repairCounts } from "@/db/writes/counts";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { writeGuestChanges } from "@/db/writes/guests";
import { DEFAULT_QUESTIONS } from "@/lib/suggested";
import { EMPTY_SUMMARY, toGuestReplies } from "@/lib/guests";
import { newId } from "@/lib/id";
import {
  createEvent,
  guestInput,
  newVisitor,
  NOW,
  readEvent,
  storedSummary,
  TEST_HOST,
} from "../helpers/events";

test("a guest's reply adds to the summary, a host edit takes it off", async () => {
  const { id, doc } = await createEvent({ questions: DEFAULT_QUESTIONS });
  const input: GuestReplyInput = {
    id: newId(),
    status: "going",
    message: null,
    people: [
      {
        name: "Ana Pop",
        answers: { age: "child", diet: { needs: ["vegan"] } },
      },
    ],
  };
  await writeGuestReply(id, doc.slug, input, newVisitor(), NOW);
  let summary = await storedSummary(id);
  expect(summary.ages.child).toBe(1);
  expect(summary.diets.vegan).toBe(1);

  /* The host saves the same card as not coming. */
  const [card] = (await readEvent(id)).replies;
  await writeGuestChanges(
    TEST_HOST,
    id,
    {
      replies: {
        put: [
          {
            id: card.id,
            isNew: false,
            status: "not_going",
            message: null,
            people: card.people,
          },
        ],
        remove: [],
      },
      list: null,
    },
    NOW,
  );
  summary = await storedSummary(id);
  expect(summary.ages.child).toBe(0);
  expect(summary.diets.vegan).toBe(0);

  /* Back to coming, then deleted. */
  await writeGuestChanges(
    TEST_HOST,
    id,
    {
      replies: {
        put: [
          {
            id: card.id,
            isNew: false,
            status: "going",
            message: null,
            people: card.people,
          },
        ],
        remove: [],
      },
      list: null,
    },
    NOW,
  );
  expect((await storedSummary(id)).ages.child).toBe(1);
  await writeGuestChanges(
    TEST_HOST,
    id,
    { replies: { put: [], remove: [card.id] }, list: null },
    NOW,
  );
  summary = await storedSummary(id);
  expect(summary.ages).toEqual({ adult: 0, child: 0, baby: 0 });
  expect(summary.diets.vegan).toBe(0);
});

test("repairCounts fixes a drifted summary", async () => {
  const { id, doc } = await createEvent({ questions: DEFAULT_QUESTIONS });
  const input: GuestReplyInput = {
    id: newId(),
    status: "going",
    message: null,
    people: [
      {
        name: "Ana Pop",
        answers: { age: "child", diet: { needs: ["vegan"] } },
      },
    ],
  };
  await writeGuestReply(id, doc.slug, input, newVisitor(), NOW);
  await db.doc(paths.event(id)).update({ "summary.ages.adult": 5 });

  const { replies, list } = await readEvent(id);
  await repairCounts(id, { replies: toGuestReplies(replies), list });
  expect(await storedSummary(id)).toEqual({
    ages: { adult: 0, child: 1, baby: 0 },
    diets: {
      vegetarian: 0,
      vegan: 1,
      glutenFree: 0,
      lactoseFree: 0,
      nutAllergy: 0,
      other: 0,
    },
    access: EMPTY_SUMMARY.access,
    suggested: EMPTY_SUMMARY.suggested,
  });
});

test("a guest's yes to transport counts once for the reply", async () => {
  const { id, doc } = await createEvent({
    questions: [
      {
        id: "transport",
        suggested: true,
        required: false,
        archived: false,
        answered: false,
      },
    ],
  });
  await writeGuestReply(
    id,
    doc.slug,
    { ...guestInput(["A", "B"]), answers: { transport: true } },
    newVisitor(),
    NOW,
  );
  expect((await storedSummary(id)).suggested.transport).toBe(1);
});
