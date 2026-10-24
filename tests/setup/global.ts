/*
 * Runs once before the tests: refuses anything but the test emulator, then
 * empties it. Each test makes its own events, so nothing is cleared between them.
 */

/** A local test project (`demo-…-test`): never a real one, never the dev emulators' `demo-festio`. */
const TEST_PROJECT = /^demo-.+-test$/;

export default async function setup() {
  const host = process.env.FIRESTORE_EMULATOR_HOST;
  /* `emulators:exec` names the project it started (`npm test`'s `--project`). */
  const project = process.env.GCLOUD_PROJECT;
  if (!host || !project || !TEST_PROJECT.test(project)) {
    throw new Error("The tests only run on the test emulator: use `npm test`.");
  }
  const url = `http://${host}/emulator/v1/projects/${project}/databases/(default)/documents`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok)
    throw new Error(`Emptying the test emulator failed: ${url}`);
}
