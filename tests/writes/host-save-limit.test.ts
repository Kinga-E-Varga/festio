import { expect, test } from "vitest";
import { countHostSave } from "@/db/writes/rate-limit";
import { HOUR_MS } from "@/lib/event";
import { newId } from "@/lib/id";
import { NOW } from "../helpers/events";

/* 150 host saves an hour per account (`HOST_SAVE_LIMIT_PER_HOUR`), every save counted. */

test("the 151st save in an hour is refused; other hosts and the next hour start from zero", async () => {
  const host = newId();
  for (let at = 0; at < 150; at++) {
    expect(await countHostSave(host, NOW)).toBe("ok");
  }
  expect(await countHostSave(host, NOW)).toBe("tooMany");
  expect(await countHostSave(host, NOW)).toBe("tooMany");

  expect(await countHostSave(newId(), NOW)).toBe("ok");
  const nextHour = new Date(NOW.getTime() + HOUR_MS);
  expect(await countHostSave(host, nextHour)).toBe("ok");
}, 60_000);
