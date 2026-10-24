import { expect, test } from "vitest";
import {
  createEvent,
  NO_COUNTS,
  recount,
  storedCounts,
} from "./helpers/events";

test("the server's clock is New York's, never an event's zone", () => {
  expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(
    "America/New_York",
  );
});

test("an event written by createEvent reads back with zero counts", async () => {
  const { id } = await createEvent();
  const [counts, recounted] = await Promise.all([
    storedCounts(id),
    recount(id),
  ]);
  expect(counts).toEqual(NO_COUNTS);
  expect(recounted).toEqual(NO_COUNTS);
});
