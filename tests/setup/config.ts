/*
 * What both Vitest configs share (`vitest.config.mts`, `vitest.app.config.mts`):
 * a plain file, as the app's build type-checks the configs and they can't
 * import each other by their `.mts` names.
 */

/** The tests' environment: the test emulator's project, its secret, the server's clock. */
export const TEST_ENV: Record<string, string> = {
  NEXT_PUBLIC_USE_EMULATORS: "true",
  /* The project `emulators:exec` started (the npm script's `--project`), written there only. */
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.GCLOUD_PROJECT ?? "",
  FESTIO_SECRET: "test-only-not-a-secret",
  /* The emulators take any key; the browser code and the test sign-in send it. */
  NEXT_PUBLIC_FIREBASE_API_KEY: "demo-api-key",
  /* Storage never runs for the tests: it points where nothing listens, never at the dev emulator. */
  FIREBASE_STORAGE_EMULATOR_HOST: "127.0.0.1:1",
  /* Not the events' zone: proves the rules read the event's clock, not the server's. */
  TZ: "America/New_York",
};
