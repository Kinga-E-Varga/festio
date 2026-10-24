import { expect, test } from "vitest";
import { compare, table, type Measured } from "./report";

const BASE: Measured = {
  "page: home": { reads: 10, writes: 0, authChecks: 1 },
  "save: list": { reads: 5, writes: 2, authChecks: 0 },
};

test("nothing to point out when no number went up", () => {
  const now: Measured = {
    "page: home": { reads: 10, writes: 0, authChecks: 1 },
    "save: list": { reads: 4, writes: 2, authChecks: 0 },
  };
  expect(compare(now, BASE)).toEqual([]);
});

test("a rise in reads, writes or session checks is pointed out", () => {
  const now: Measured = {
    "page: home": { reads: 12, writes: 0, authChecks: 2 },
    "save: list": { reads: 5, writes: 3, authChecks: 0 },
  };
  expect(compare(now, BASE)).toEqual([
    "page: home: reads 10 → 12, session checks 1 → 2",
    "save: list: writes 2 → 3",
  ]);
});

test("a situation missing from the baseline is pointed out", () => {
  const now: Measured = {
    ...BASE,
    "page: new": { reads: 1, writes: 0, authChecks: 0 },
  };
  expect(compare(now, BASE)).toEqual(["page: new: not in the baseline yet"]);
});

test("the table shows changes only against a baseline", () => {
  const now: Measured = {
    "page: home": { reads: 12, writes: 0, authChecks: 1 },
  };
  expect(table(now)).toBe(
    [
      "| Situation | Reads | Writes | Session checks |",
      "| --- | --- | --- | --- |",
      "| page: home | 12 | 0 | 1 |",
    ].join("\n"),
  );
  expect(table(now, BASE)).toBe(
    [
      "| Situation | Reads | Writes | Session checks |",
      "| --- | --- | --- | --- |",
      "| page: home | 12 (+2) | 0 | 1 |",
    ].join("\n"),
  );
});
