import { Timestamp } from "firebase-admin/firestore";
import { expect, test } from "vitest";
import { summaryAfter, summaryOf, type StoredReply } from "@/lib/guests";

/* Every expected number is worked out by hand from the cards below. */

const SENT = Timestamp.fromDate(new Date("2029-01-01T10:00:00Z"));

const C1: StoredReply = {
  id: "c1",
  sentAt: SENT,
  status: "going",
  message: null,
  createdBy: "guest",
  answers: undefined,
  people: [
    {
      id: "p1",
      name: "One",
      ageGroup: "adult",
      diet: ["vegan", "glutenFree"],
      answers: { q1: "x" },
    },
    { id: "p2", name: "Two", ageGroup: "child" },
  ],
};
const C2: StoredReply = {
  id: "c2",
  sentAt: SENT,
  status: "not_going",
  message: null,
  createdBy: "guest",
  people: [{ id: "p3", name: "Three" }],
};
const C3: StoredReply = {
  id: "c3",
  sentAt: SENT,
  status: "going",
  message: null,
  createdBy: "guest",
  people: [
    {
      id: "p4",
      name: "Four",
      ageGroup: "baby",
      diet: [],
      answers: { q1: null },
    },
  ],
};

const NO_DIETS = {
  vegetarian: 0,
  vegan: 0,
  glutenFree: 0,
  lactoseFree: 0,
  nutAllergy: 0,
  other: 0,
};

test("summaryOf counts people coming", () => {
  expect(summaryOf([C1, C2, C3])).toEqual({
    ages: { adult: 1, child: 1, baby: 1 },
    diets: { ...NO_DIETS, vegan: 1, glutenFree: 1 },
    answeredCustom: 1,
  });
});

test("summaryAfter takes off the card as it was", () => {
  const stored = summaryOf([C1, C2, C3]);
  const after = summaryAfter(stored, [C1], [{ ...C1, status: "not_going" }]);
  expect(after).toEqual({
    ages: { adult: 0, child: 0, baby: 1 },
    diets: NO_DIETS,
    answeredCustom: 0,
  });
});
