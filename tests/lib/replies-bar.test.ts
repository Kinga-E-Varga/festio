import { expect, test } from "vitest";
import { repliesBarVars } from "@/lib/event";

/* Every share worked out by hand: a part's count over the bar's scale, the larger of expected and replied. */

test("past expected, the bar is every reply, each part its share of them", () => {
  const vars = repliesBarVars({
    rsvp: { replied: 125, attending: 90, declined: 35 },
    expectedGuests: 100,
  });
  /* 90 / 125, 35 / 125: whole shares, no float noise */
  expect(vars).toEqual({ "--attending": "72%", "--declined": "28%" });
});

test("short of expected, each part is its share of expected", () => {
  const vars = repliesBarVars({
    rsvp: { replied: 50, attending: 30, declined: 20 },
    expectedGuests: 100,
  });
  expect(vars).toEqual({ "--attending": "30%", "--declined": "20%" });
});
