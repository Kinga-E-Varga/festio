import { expect, test } from "vitest";
import { eventSchema, eventSettingsSchema } from "@/db/schemas/event";

/* Guests invited: at most 600 (`EXPECTED_GUESTS_MAX`). */

const settings = {
  title: "Test event",
  kind: "wedding",
  language: "en",
  date: "2030-06-15",
  slug: "test-event",
  visibility: "public",
  preloaded: false,
  version: 0,
};

test("600 guests invited is taken", () => {
  expect(
    eventSettingsSchema.safeParse({ ...settings, expectedGuests: 600 }).success,
  ).toBe(true);
});

test("601 guests invited is refused", () => {
  expect(
    eventSettingsSchema.safeParse({ ...settings, expectedGuests: 601 }).success,
  ).toBe(false);
});

test("an event card can't hold 601 guests invited either", () => {
  const card = eventSchema.shape.expectedGuests;
  expect(card.safeParse(600).success).toBe(true);
  expect(card.safeParse(601).success).toBe(false);
});
