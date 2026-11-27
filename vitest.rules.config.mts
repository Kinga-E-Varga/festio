import { defineConfig } from "vitest/config";

/* `npm run test:rules`: the security rules, in their own emulator (Firestore and Storage). */
export default defineConfig({
  test: {
    include: ["tests/rules/**/*.test.ts"],
    /* One emulator: files side by side would clear each other's seed. */
    fileParallelism: false,
  },
});
