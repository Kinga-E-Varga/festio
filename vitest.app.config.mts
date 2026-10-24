import { defineConfig } from "vitest/config";
import { TEST_ENV } from "./tests/setup/config";

/*
 * `npm run test:app` and `npm run cost`: like `npm test`, plus a second copy
 * of the app built and started on the test emulator (`tests/app/global.ts`),
 * signed in through the test Auth emulator.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ["tests/app/**/*.test.ts", "tests/cost/measure.test.ts"],
    globalSetup: "tests/app/global.ts",
    fileParallelism: false,
    /* Each test asks the app for pages; a first visit can take a few seconds. */
    testTimeout: 30_000,
    /* No Auth host here: this run's emulator sets it, and `tests/app/global.ts` checks it. */
    env: TEST_ENV,
  },
});
