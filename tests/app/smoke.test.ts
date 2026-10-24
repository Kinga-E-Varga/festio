import { expect, test } from "vitest";
import { SEED_HOST } from "../../seed/build";
import { appDbCount, page } from "./fetch";
import { hostCookie } from "./session";

/* The pages themselves are checked in `access.test.ts`; this is the counter route. */
test("the counter route counts", async () => {
  await page("/dashboard", await hostCookie(SEED_HOST));
  expect((await appDbCount()).reads).toBeGreaterThan(0);
  expect((await appDbCount()).reads).toBe(0);
});
