import { expect, test } from "vitest";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import {
  deletionDate,
  isRealDate,
  replyCloseAt,
  shiftDay,
  toDateTimeLocal,
  todayIn,
} from "@/lib/event";

/*
 * The server's clock is New York's (`vitest.config.mts`), never the events'.
 * Every expected moment is worked out by hand, in UTC.
 */

test("the host's own closing time is read on the event's clock", () => {
  /* Auckland is UTC+13 in March (summer time). */
  const at = replyCloseAt({
    date: "2027-03-20",
    repliesCloseAt: "2027-03-10T18:00",
    timeZone: "Pacific/Auckland",
  });
  expect(at.toISOString()).toBe("2027-03-10T05:00:00.000Z");
});

test("the default close is 00:00 the day before, on the event's clock", () => {
  const at = replyCloseAt({ date: "2027-06-15", timeZone: "Europe/Bucharest" });
  expect(at.toISOString()).toBe("2027-06-13T21:00:00.000Z");
});

test("a closing time on the spring-forward day uses the new offset", () => {
  /* Bucharest moves from UTC+2 to UTC+3 at 03:00 on 28 March 2027. */
  const at = replyCloseAt({
    date: "2027-04-10",
    repliesCloseAt: "2027-03-28T10:00",
    timeZone: "Europe/Bucharest",
  });
  expect(at.toISOString()).toBe("2027-03-28T07:00:00.000Z");
});

test("a closing time on the fall-back day uses the old offset again", () => {
  /* Bucharest moves from UTC+3 back to UTC+2 at 04:00 on 31 October 2027. */
  const at = replyCloseAt({
    date: "2027-11-10",
    repliesCloseAt: "2027-10-31T10:00",
    timeZone: "Europe/Bucharest",
  });
  expect(at.toISOString()).toBe("2027-10-31T08:00:00.000Z");
});

test("a time skipped by spring-forward lands just after the jump", () => {
  const at = replyCloseAt({
    date: "2027-04-10",
    repliesCloseAt: "2027-03-28T03:30",
    timeZone: "Europe/Bucharest",
  });
  expect(isRealDate(at)).toBe(true);
  expect(at.getTime()).toBeGreaterThanOrEqual(
    Date.parse("2027-03-28T01:00:00Z"),
  );
  expect(at.getTime()).toBeLessThan(Date.parse("2027-03-28T02:00:00Z"));
});

test("a time that happens twice at fall-back is one of its two moments", () => {
  const at = replyCloseAt({
    date: "2027-11-10",
    repliesCloseAt: "2027-10-31T03:30",
    timeZone: "Europe/Bucharest",
  });
  expect(["2027-10-31T00:30:00.000Z", "2027-10-31T01:30:00.000Z"]).toContain(
    at.toISOString(),
  );
});

test("today is the event's calendar day, not the server's", () => {
  const now = new Date("2027-03-10T05:00:00Z");
  expect(todayIn("Pacific/Auckland", now)).toBe("2027-03-10");
  expect(todayIn("America/Los_Angeles", now)).toBe("2027-03-09");
});

test("the deletion date is the retention window in calendar days, across a clock change", () => {
  /* New York springs forward on 14 March 2027, inside the window. With 60 days: 2027-04-02. */
  const at = deletionDate("2027-02-01");
  expect(toDateTimeLocal(at)).toBe(
    `${shiftDay("2027-02-01", GUEST_DATA_RETENTION_DAYS)}T00:00`,
  );
});
