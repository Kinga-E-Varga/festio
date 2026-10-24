import { expect, test } from "vitest";
import { testEmulator } from "./guard";

/* The dev emulators' ports are in `firebase.json`: Firestore 8080, Auth 9099. */
const GOOD = {
  FIRESTORE_EMULATOR_HOST: "127.0.0.1:8180",
  FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9189",
  GCLOUD_PROJECT: "demo-festio-test",
};

test("the test emulator passes", () => {
  expect(testEmulator(GOOD, { auth: true })).toEqual({
    host: "127.0.0.1:8180",
    project: "demo-festio-test",
  });
});

test("the dev project or a real one is refused", () => {
  expect(() =>
    testEmulator({ ...GOOD, GCLOUD_PROJECT: "demo-festio" }),
  ).toThrow();
  expect(() =>
    testEmulator({ ...GOOD, GCLOUD_PROJECT: "festio-prod" }),
  ).toThrow();
});

test("the dev emulators' ports are refused", () => {
  expect(() =>
    testEmulator({ ...GOOD, FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080" }),
  ).toThrow();
  expect(() =>
    testEmulator(
      { ...GOOD, FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099" },
      { auth: true },
    ),
  ).toThrow();
});

test("a run that needs Auth refuses to go without its emulator", () => {
  const noAuth = {
    FIRESTORE_EMULATOR_HOST: GOOD.FIRESTORE_EMULATOR_HOST,
    GCLOUD_PROJECT: GOOD.GCLOUD_PROJECT,
  };
  expect(() => testEmulator(noAuth, { auth: true })).toThrow();
  expect(() => testEmulator(noAuth)).not.toThrow();
});
