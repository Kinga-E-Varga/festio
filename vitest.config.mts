import { defineConfig } from "vitest/config";

/*
 * `npm test` runs this inside its own Firestore emulator (`firebase.test.json`),
 * so the tests never touch the dev emulators or their seed.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ["tests/**/*.test.ts"],
    globalSetup: "tests/setup/global.ts",
    /* One emulator: files run side by side make its transactions wait on each other until tests time out. */
    fileParallelism: false,
    env: {
      NEXT_PUBLIC_USE_EMULATORS: "true",
      /* The project `npm test` started the emulator with (`--project`), written there only. */
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.GCLOUD_PROJECT ?? "",
      FESTIO_SECRET: "test-only-not-a-secret",
      /* Only Firestore runs for the tests: Auth and Storage point where nothing listens, never at the dev emulators. */
      FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:1",
      FIREBASE_STORAGE_EMULATOR_HOST: "127.0.0.1:1",
      /* Not the events' zone: proves the rules read the event's clock, not the server's. */
      TZ: "America/New_York",
    },
  },
});
