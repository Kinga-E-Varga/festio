import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { setTimeout as sleep } from "node:timers/promises";
import { TEST_ENV } from "../setup/config";
import { testEmulator } from "../setup/guard";

/*
 * Runs once before the page tests and the cost check: the dev seed into the
 * test emulator and a second copy of the app built into `.next-test`, then
 * that copy started on its own port, counting every read and write. Never the
 * dev emulators, never `npm run dev`'s build.
 */

const PORT = 3100;
export const APP_URL = `http://127.0.0.1:${PORT}`;
const NEXT = "node_modules/.bin/next";

/** What the seed and the app copy run with: the tests' environment, counting on. */
function appEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    ...TEST_ENV,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: `${TEST_ENV.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    FESTIO_COUNT_DB: "true",
    FESTIO_DIST_DIR: ".next-test",
  };
}

/** Runs a command to the end; a failure stops the tests with its output. */
async function run(command: string, args: string[], env: NodeJS.ProcessEnv) {
  const child = spawn(command, args, { env, stdio: "inherit" });
  const [code] = await once(child, "exit");
  if (code !== 0) throw new Error(`${command} ${args.join(" ")} failed`);
}

/** Whether anything answers on the app copy's port. */
async function answers(): Promise<boolean> {
  const answer = await fetch(`${APP_URL}/api/dev/db-count`).catch(() => null);
  return Boolean(answer?.ok);
}

/** Waits until this server answers, for up to a minute; stops at once if it quits. */
async function ready(server: ChildProcess): Promise<void> {
  for (let tries = 0; tries < 120; tries++) {
    if (server.exitCode !== null) {
      throw new Error("The app copy stopped before it answered.");
    }
    if (await answers()) return;
    await sleep(500);
  }
  throw new Error("The app copy never answered on the test emulator.");
}

export default async function setup() {
  testEmulator(process.env, { auth: true });
  const env = appEnv();
  /* An old copy left running would answer instead, and the tests would check old code. */
  if (await answers()) {
    throw new Error(`Port ${PORT} is taken: stop the old app copy first.`);
  }
  /* Neither needs the other: the build reads no data. */
  await Promise.all([
    run("node", ["--import", "tsx", "seed/index.ts"], env),
    run(NEXT, ["build"], env),
  ]);

  /* Its own process group, so stopping it stops everything it started. */
  const server: ChildProcess = spawn(
    NEXT,
    ["start", "-p", String(PORT), "-H", "127.0.0.1"],
    { env, stdio: "inherit", detached: true },
  );
  const stop = async () => {
    if (server.exitCode !== null) return;
    const exited = once(server, "exit");
    process.kill(-(server.pid as number));
    await exited;
  };
  await ready(server).catch(async (error: unknown) => {
    await stop();
    throw error;
  });
  return stop;
}
