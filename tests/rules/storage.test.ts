import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { deleteObject, getBytes, ref, uploadBytes } from "firebase/storage";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { seed, startEnvironment } from "./setup";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await startEnvironment();
});
beforeEach(async () => {
  await seed(env);
});
afterAll(async () => {
  await env.cleanup();
});

const hostA = () => env.authenticatedContext("hostA").storage();
const hostB = () => env.authenticatedContext("hostB").storage();
const out = () => env.unauthenticatedContext().storage();

const MB = 1048576;

/** An upload of an exact number of bytes. */
const upload = (
  storage: ReturnType<typeof hostA>,
  path: string,
  bytes: number,
  contentType = "image/webp",
) => uploadBytes(ref(storage, path), new Uint8Array(bytes), { contentType });

describe("Storage rules", () => {
  it("S1 the host uploads an image into their event", async () => {
    await assertSucceeds(upload(hostA(), "events/e1/a.webp", 500_000));
  });

  it("S2 at most 1 MB a file, inclusive", async () => {
    await assertSucceeds(upload(hostA(), "events/e1/a.webp", MB));
    await assertFails(upload(hostA(), "events/e1/b.webp", MB + 1));
  });

  it("S3 images only, and no SVG", async () => {
    await assertFails(upload(hostA(), "events/e1/a.txt", 100, "text/plain"));
    await assertFails(upload(hostA(), "events/e1/a.svg", 100, "image/svg+xml"));
    await assertSucceeds(upload(hostA(), "events/e1/a.jpg", 100, "image/jpeg"));
    await assertSucceeds(upload(hostA(), "events/e1/a.png", 100, "image/png"));
  });

  it("S4 no one but the host uploads into the event", async () => {
    await assertFails(upload(hostB(), "events/e1/a.webp", 100));
    await assertFails(upload(out(), "events/e1/a.webp", 100));
  });

  it("S5 not into another host's event or one with no card", async () => {
    await assertFails(upload(hostA(), "events/e2/a.webp", 100));
    await assertFails(upload(hostA(), "events/missing/a.webp", 100));
  });

  it("S6 not outside events/", async () => {
    await assertFails(upload(hostA(), "other/a.webp", 100));
  });

  it("S7 only the host deletes a photo", async () => {
    await assertFails(deleteObject(ref(hostB(), "events/e1/old.webp")));
    await assertSucceeds(deleteObject(ref(hostA(), "events/e1/old.webp")));
  });

  it("S8 the host reads a photo; signed out cannot", async () => {
    await assertSucceeds(getBytes(ref(hostA(), "events/e1/old.webp")));
    await assertFails(getBytes(ref(out(), "events/e1/old.webp")));
  });
});
