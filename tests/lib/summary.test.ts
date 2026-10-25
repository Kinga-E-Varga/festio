import { Timestamp } from "firebase-admin/firestore";
import { expect, test } from "vitest";
import {
  EMPTY_SUMMARY,
  summaryAfter,
  summaryOf,
  type StoredReply,
} from "@/lib/guests";

/* Every expected number is worked out by hand from the cards below. */

const SENT = Timestamp.fromDate(new Date("2029-01-01T10:00:00Z"));

const C1: StoredReply = {
  id: "c1",
  sentAt: SENT,
  status: "going",
  message: null,
  createdBy: "guest",
  answers: {
    transport: true,
    accommodation: false,
    song: "Abba",
    phone: null,
    cake: "Yes please",
  },
  people: [
    {
      id: "p1",
      name: "One",
      answers: {
        age: "adult",
        diet: { needs: ["vegan", "glutenFree"] },
        accessibility: { needs: ["stepFree", "hearing"] },
      },
    },
    {
      id: "p2",
      name: "Two",
      answers: {
        age: "child",
        diet: { needs: [] },
        accessibility: { needs: [] },
      },
    },
  ],
};
const C2: StoredReply = {
  id: "c2",
  sentAt: SENT,
  status: "going",
  message: null,
  createdBy: "guest",
  answers: { transport: false, accommodation: true },
  people: [
    {
      id: "p3",
      name: "Three",
      answers: {
        age: "baby",
        diet: { needs: ["other"], other: "No onions" },
        accessibility: { needs: ["other"], other: "Guide dog" },
      },
    },
  ],
};
const C3: StoredReply = {
  id: "c3",
  sentAt: SENT,
  status: "not_going",
  message: null,
  createdBy: "guest",
  people: [{ id: "p4", name: "Four" }],
};

const NO_DIETS = {
  vegetarian: 0,
  vegan: 0,
  glutenFree: 0,
  lactoseFree: 0,
  nutAllergy: 0,
  other: 0,
};

const NO_ACCESS = { stepFree: 0, walking: 0, hearing: 0, sight: 0, other: 0 };

const NO_SUGGESTED = { transport: 0, accommodation: 0 };

test("summaryOf counts people coming, reply-wide answers once per reply", () => {
  expect(summaryOf([C1, C2, C3])).toEqual({
    ages: { adult: 1, child: 1, baby: 1 },
    diets: { ...NO_DIETS, vegan: 1, glutenFree: 1, other: 1 },
    access: { ...NO_ACCESS, stepFree: 1, hearing: 1, other: 1 },
    suggested: { transport: 1, accommodation: 1 },
  });
});

test("summaryAfter never goes below zero", () => {
  expect(summaryAfter(EMPTY_SUMMARY, [C1], [])).toEqual({
    ages: { adult: 0, child: 0, baby: 0 },
    diets: NO_DIETS,
    access: NO_ACCESS,
    suggested: NO_SUGGESTED,
  });
});

test("summaryAfter takes off the card as it was", () => {
  const stored = summaryOf([C1, C2, C3]);
  const after = summaryAfter(stored, [C1], [{ ...C1, status: "not_going" }]);
  expect(after).toEqual({
    ages: { adult: 0, child: 0, baby: 1 },
    diets: { ...NO_DIETS, other: 1 },
    access: { ...NO_ACCESS, other: 1 },
    suggested: { ...NO_SUGGESTED, accommodation: 1 },
  });
});
