import firebaseConfig from "../../firebase.json";

/*
 * What every test run checks before touching anything: it is on the test
 * emulators, never the dev ones (`firebase.json`'s ports, project
 * `demo-festio`) and never a real project.
 */

/** A local test project (`demo-…-test`). */
const TEST_PROJECT = /^demo-.+-test$/;

const DEV_PORTS = new Set(
  Object.values(firebaseConfig.emulators).flatMap((emulator) =>
    typeof emulator === "object" && "port" in emulator
      ? [String(emulator.port)]
      : [],
  ),
);

function onDevPort(host: string): boolean {
  return DEV_PORTS.has(host.split(":").pop() ?? "");
}

/**
 * The test emulator's Firestore address and project, or a stop. `auth`: the
 * run uses Auth too, so its test emulator must be set as well.
 */
export function testEmulator(
  env: Record<string, string | undefined> = process.env,
  { auth = false }: { auth?: boolean } = {},
): { host: string; project: string } {
  /* `emulators:exec` sets these for the project it started (the npm script's `--project`). */
  const host = env.FIRESTORE_EMULATOR_HOST;
  const project = env.GCLOUD_PROJECT;
  const authHost = env.FIREBASE_AUTH_EMULATOR_HOST;
  if (
    !host ||
    onDevPort(host) ||
    !project ||
    !TEST_PROJECT.test(project) ||
    (auth && (!authHost || onDevPort(authHost)))
  ) {
    throw new Error(
      "The tests only run on the test emulators: use the npm scripts.",
    );
  }
  return { host, project };
}
