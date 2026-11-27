import { defineConfig } from "vitest/config";
import { TEST_ENV } from "./tests/setup/config";

/*
 * `npm test` runs this inside its own Firestore emulator (`firebase.test.json`),
 * so the tests never touch the dev emulators or their seed.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ["tests/**/*.test.ts"],
    /* The rules tests have their own run: `npm run test:rules`. The next two need the app running: `npm run test:app` and `npm run cost`. */
    exclude: ["tests/app/**", "tests/rules/**", "tests/cost/measure.test.ts"],
    globalSetup: "tests/setup/global.ts",
    /* One emulator: files run side by side make its transactions wait on each other until tests time out. */
    fileParallelism: false,
    env: {
      ...TEST_ENV,
      /* Only Firestore runs for `npm test`: Auth points where nothing listens, never at the dev emulator. */
      FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:1",
    },
  },
});
