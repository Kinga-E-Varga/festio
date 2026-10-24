import { expect, test } from "vitest";
import { unlockAttempt } from "@/db/writes/rate-limit";
import { PASSWORD_LIMIT_PER_HOUR } from "@/lib/config";
import { createEvent, newVisitor, NOW } from "../helpers/events";

async function protectedEvent(): Promise<string> {
  const { id } = await createEvent({
    visibility: "protected",
    password: "abcd",
  });
  return id;
}

test("the try after the hour's limit is refused, even the right password", async () => {
  const id = await protectedEvent();
  const { key } = newVisitor();
  for (let i = 0; i < PASSWORD_LIMIT_PER_HOUR; i++) {
    expect(await unlockAttempt(id, key, false, NOW)).toBe("wrong");
  }
  expect(await unlockAttempt(id, key, true, NOW)).toBe("tooMany");
});

test("a right password is not counted as a try", async () => {
  const id = await protectedEvent();
  const { key } = newVisitor();
  for (let i = 0; i < PASSWORD_LIMIT_PER_HOUR - 1; i++) {
    await unlockAttempt(id, key, false, NOW);
  }
  expect(await unlockAttempt(id, key, true, NOW)).toBe("ok");
  expect(await unlockAttempt(id, key, false, NOW)).toBe("wrong");
  expect(await unlockAttempt(id, key, true, NOW)).toBe("tooMany");
});

test("each visitor has their own limit", async () => {
  const id = await protectedEvent();
  const first = newVisitor().key;
  for (let i = 0; i < PASSWORD_LIMIT_PER_HOUR; i++) {
    await unlockAttempt(id, first, false, NOW);
  }
  expect(await unlockAttempt(id, first, true, NOW)).toBe("tooMany");
  expect(await unlockAttempt(id, newVisitor().key, true, NOW)).toBe("ok");
});
