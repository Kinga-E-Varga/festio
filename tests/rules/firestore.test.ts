import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
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

const hostA = () => env.authenticatedContext("hostA").firestore();
const hostB = () => env.authenticatedContext("hostB").firestore();
const out = () => env.unauthenticatedContext().firestore();

const CARDS = [
  "events/e1/invitation/content",
  "events/e1/guestList/names",
  "events/e1/seating/chart",
];

describe("Firestore rules", () => {
  it("F1 a host gets their own event", async () => {
    await assertSucceeds(getDoc(doc(hostA(), "events/e1")));
  });

  it("F2 a host queries events by their own id", async () => {
    await assertSucceeds(
      getDocs(
        query(collection(hostA(), "events"), where("hostId", "==", "hostA")),
      ),
    );
  });

  it("F3 a host cannot query every event", async () => {
    await assertFails(getDocs(collection(hostA(), "events")));
  });

  it("F4 a host cannot get another host's event", async () => {
    await assertFails(getDoc(doc(hostA(), "events/e2")));
  });

  it("F5 a host gets the cards inside their event", async () => {
    for (const path of CARDS) await assertSucceeds(getDoc(doc(hostA(), path)));
  });

  it("F6 another host gets none of those cards", async () => {
    for (const path of CARDS) await assertFails(getDoc(doc(hostB(), path)));
  });

  it("F7 a host reads their event's replies", async () => {
    await assertSucceeds(
      getDocs(
        query(
          collection(hostA(), "events/e1/replies"),
          where("hostId", "==", "hostA"),
        ),
      ),
    );
    await assertSucceeds(getDoc(doc(hostA(), "events/e1/replies/r1")));
  });

  it("F8 another host cannot get a reply", async () => {
    await assertFails(getDoc(doc(hostB(), "events/e1/replies/r1")));
  });

  it("F9 signed out reads nothing", async () => {
    await assertFails(getDoc(doc(out(), "events/e1")));
    await assertFails(getDoc(doc(out(), "events/e1/replies/r1")));
    await assertFails(getDoc(doc(out(), "users/hostA")));
  });

  it("F10 a host writes nothing from the browser", async () => {
    const db = hostA();
    await assertFails(setDoc(doc(db, "events/e1"), { hostId: "hostA" }));
    await assertFails(updateDoc(doc(db, "events/e1"), { title: "x" }));
    await assertFails(deleteDoc(doc(db, "events/e1/replies/r1")));
    await assertFails(setDoc(doc(db, "events/new"), { hostId: "hostA" }));
    await assertFails(
      setDoc(doc(db, "events/e1/replies/new"), { hostId: "hostA" }),
    );
    await assertFails(updateDoc(doc(db, "users/hostA"), { name: "x" }));
  });

  it("F11 only the user reads their own card", async () => {
    await assertSucceeds(getDoc(doc(hostA(), "users/hostA")));
    await assertFails(getDoc(doc(hostA(), "users/hostB")));
  });

  it("F12 replies cannot be listed without the host filter", async () => {
    await assertFails(getDocs(collection(hostA(), "events/e1/replies")));
  });

  it("F13 slugs, payments and rate limits are closed", async () => {
    const paths = ["slugs/maria", "payments/p1", "rateLimits/k1"];
    for (const path of paths) {
      await assertFails(getDoc(doc(hostA(), path)));
      await assertFails(getDoc(doc(out(), path)));
    }
    await assertFails(
      getDocs(
        query(collection(hostA(), "payments"), where("hostId", "==", "hostA")),
      ),
    );
  });
});
