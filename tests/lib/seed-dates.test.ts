import { afterEach, expect, test, vi } from "vitest";
import { dayFromNow } from "../../seed/build";

/*
 * The seed's days are calendar days on Bucharest's clock, counted from the
 * day it runs. Expected days worked out by hand.
 */

afterEach(() => {
  vi.useRealTimers();
});

test("a day the clocks change still counts as one day", () => {
  /* 00:30 on 25 October 2026 in Bucharest (summer time, UTC+3); that day has 25 hours. */
  vi.useFakeTimers({ now: new Date("2026-10-24T21:30:00Z") });
  expect(dayFromNow(0)).toBe("2026-10-25");
  expect(dayFromNow(2)).toBe("2026-10-27");
  expect(dayFromNow(-14)).toBe("2026-10-11");
});

test("a day the clocks go forward still counts as one day", () => {
  /* 23:30 on 28 March 2026 in Bucharest (UTC+2); the next day has 23 hours. */
  vi.useFakeTimers({ now: new Date("2026-03-28T21:30:00Z") });
  expect(dayFromNow(1)).toBe("2026-03-29");
  expect(dayFromNow(2)).toBe("2026-03-30");
});
