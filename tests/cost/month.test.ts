import { expect, test } from "vitest";
import { month, USE } from "./month";
import type { Measured } from "./report";

/*
 * Made-up measurements, so the arithmetic is checked by hand: every page 10
 * reads, every save or reply 1 read and 2 writes.
 *
 * Page views: 10 + 40 + 20 + 20 + 3 + 5 + 2 + 450 = 550 → 5,500 reads.
 * Saves: 3 + 5 + 10 + 20 + 50 + 10 + 20 = 118 → 118 reads, 236 writes.
 * Reloads after a save: settings 3, invitation 5, guest list 10 → 18 pages, 180 reads.
 * A month: 5,798 reads, 236 writes; a day: 193.27 reads, 7.87 writes.
 * Free a day: 50,000 / 193.27 = 258.71 events (writes allow 2,542) → 258.
 * Paid: 5,798 × $0.03 + 236 × $0.09, per 100,000 → $0.0019518.
 */
function madeUp(): Measured {
  return Object.fromEntries(
    USE.map(({ situation: name }) => [
      name,
      name.startsWith("page") || name.startsWith("guest:")
        ? { reads: 10, writes: 0, authChecks: 0 }
        : { reads: 1, writes: 2, authChecks: 0 },
    ]),
  );
}

test("a month adds up every situation times how often it happens, reloads included", () => {
  const result = month(madeUp());
  expect(result.reads).toBe(5798);
  expect(result.writes).toBe(236);
  expect(result.readsPerDay).toBeCloseTo(193.27, 2);
  expect(result.writesPerDay).toBeCloseTo(7.87, 2);
});

test("events that fit the free allowance, and what one costs after", () => {
  const result = month(madeUp());
  expect(result.eventsFreePerDay).toBe(258);
  expect(result.costPerEventUsd).toBeCloseTo(0.0019518, 7);
});

test("a situation the month needs but nobody measured is an error", () => {
  expect(() => month({})).toThrow("page: landing (signed in)");
});
