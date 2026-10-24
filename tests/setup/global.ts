import { testEmulator } from "./guard";

/*
 * Runs once before the tests: refuses anything but the test emulator, then
 * empties it. Each test makes its own events, so nothing is cleared between them.
 */

export default async function setup() {
  const { host, project } = testEmulator();
  const url = `http://${host}/emulator/v1/projects/${project}/databases/(default)/documents`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok)
    throw new Error(`Emptying the test emulator failed: ${url}`);
}
