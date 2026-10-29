import { expect, test } from "vitest";
import { daysAround } from "@/modular/content";

test("two days either side, each its distance, day and short weekday", () => {
  expect(daysAround("2027-09-18", "en", 2)).toEqual([
    { offset: -2, date: 16, weekday: "Thu" },
    { offset: -1, date: 17, weekday: "Fri" },
    { offset: 0, date: 18, weekday: "Sat" },
    { offset: 1, date: 19, weekday: "Sun" },
    { offset: 2, date: 20, weekday: "Mon" },
  ]);
});

test("crosses into the month before and after", () => {
  expect(daysAround("2027-10-01", "en", 2).map(({ date }) => date)).toEqual([
    29, 30, 1, 2, 3,
  ]);
});

test("over a clock change the days still follow one another", () => {
  // Summer time ends on 31 October 2027 in Europe.
  expect(daysAround("2027-10-31", "en", 1).map(({ date }) => date)).toEqual([
    30, 31, 1,
  ]);
});

test("weekdays in the invitation's language", () => {
  const [day] = daysAround("2027-09-18", "ro", 0);
  expect(day.weekday).toBe("sâm.");
});
