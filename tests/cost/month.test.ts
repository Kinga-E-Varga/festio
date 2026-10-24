import { expect, test } from "vitest";
import { month, USE } from "./month";
import type { Measured } from "./report";

/*
 * Made-up measurements, so the arithmetic is checked by hand: every page or
 * panel 10 reads, every save or reply 1 read and 2 writes.
 *
 * Page and panel views: 10 + 40 + 20 + 20 + 3 + 5 + 2 + 20 + 450 = 570 → 5,700 reads.
 * Saves: 3 + 5 + 10 + 20 + 50 + 10 + 20 = 118 → 118 reads, 236 writes.
 * Reloads after a save: settings 3, invitation 5, guest list 10 → 18 pages, 180 reads.
 * A month: 5,998 reads, 236 writes; a day: 199.93 reads, 7.87 writes.
 * Free a day: 50,000 / 199.93 = 250.08 events (writes allow 2,542) → 250.
 * Paid: 5,998 × $0.03 + 236 × $0.09, per 100,000 → $0.0020118.
 */
function madeUp(): Measured {
  return Object.fromEntries(
    USE.map(({ situation: name }) => [
      name,
      name.startsWith("page") ||
      name.startsWith("panel") ||
      name.startsWith("guest:")
        ? { reads: 10, writes: 0, authChecks: 0 }
        : { reads: 1, writes: 2, authChecks: 0 },
    ]),
  );
}

test("a month adds up every situation times how often it happens, reloads included", () => {
  const result = month(madeUp());
  expect(result.reads).toBe(5998);
  expect(result.writes).toBe(236);
  expect(result.readsPerDay).toBeCloseTo(199.93, 2);
  expect(result.writesPerDay).toBeCloseTo(7.87, 2);
});

test("events that fit the free allowance, and what one costs after", () => {
  const result = month(madeUp());
  expect(result.eventsFreePerDay).toBe(250);
  expect(result.costPerEventUsd).toBeCloseTo(0.0020118, 7);
});

test("a situation the month needs but nobody measured is an error", () => {
  expect(() => month({})).toThrow("page: landing (signed in)");
});
