import { expect, test } from "vitest";
import { createMemo } from "@/lib/memo";

test("returns what was set", () => {
  const memo = createMemo<string>({ ttlMs: 1000, maxEntries: 5 });
  memo.set("a", "one");
  expect(memo.get("a")).toBe("one");
  expect(memo.get("b")).toBeUndefined();
});

test("forgets an entry after its time", () => {
  let now = 0;
  const memo = createMemo<string>({
    ttlMs: 1000,
    maxEntries: 5,
    now: () => now,
  });
  memo.set("a", "one");
  now = 1000;
  expect(memo.get("a")).toBe("one");
  now = 1001;
  expect(memo.get("a")).toBeUndefined();
});

test("drops the least recently used past the limit", () => {
  const memo = createMemo<string>({ ttlMs: 1000, maxEntries: 2 });
  memo.set("a", "1");
  memo.set("b", "2");
  memo.get("a");
  memo.set("c", "3");
  expect(memo.get("b")).toBeUndefined();
  expect(memo.get("a")).toBe("1");
  expect(memo.get("c")).toBe("3");
});

test("delete forgets it", () => {
  const memo = createMemo<string>({ ttlMs: 1000, maxEntries: 5 });
  memo.set("a", "one");
  memo.delete("a");
  expect(memo.get("a")).toBeUndefined();
});
