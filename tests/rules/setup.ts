import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import testConfig from "../../firebase.test.json";

/** Splits "127.0.0.1:8180" (what `emulators:exec` puts in the environment). */
function hostAndPort(value: string | undefined, fallback: number) {
  const [host, port] = (value ?? `127.0.0.1:${fallback}`).split(":");
  return { host, port: Number(port) };
}

/** The rules from disk, the emulators `emulators:exec` started. */
export async function startEnvironment(): Promise<RulesTestEnvironment> {
  return initializeTestEnvironment({
    projectId: "demo-festio-rules",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      ...hostAndPort(
        process.env.FIRESTORE_EMULATOR_HOST,
        testConfig.emulators.firestore.port,
      ),
    },
    storage: {
      rules: readFileSync("storage.rules", "utf8"),
      ...hostAndPort(
        process.env.FIREBASE_STORAGE_EMULATOR_HOST,
        testConfig.emulators.storage.port,
      ),
    },
  });
}

/** The documents every test starts from, written with the rules off. */
const SEED: [string, Record<string, unknown>][] = [
  ["events/e1", { hostId: "hostA" }],
  ["events/e2", { hostId: "hostB" }],
  ["events/e1/replies/r1", { hostId: "hostA" }],
  ["events/e1/invitation/content", {}],
  ["events/e1/guestList/names", {}],
  ["events/e1/seating/chart", {}],
  ["users/hostA", {}],
  ["users/hostB", {}],
  ["slugs/maria", { eventId: "e1" }],
  ["payments/p1", { hostId: "hostA" }],
  ["rateLimits/k1", { count: 1 }],
];

/** Clears both emulators, then writes the seed (Firestore and the one old photo). */
export async function seed(env: RulesTestEnvironment) {
  await env.clearFirestore();
  await env.clearStorage();
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    for (const [path, data] of SEED) await setDoc(doc(db, path), data);
    await uploadBytes(
      ref(context.storage(), "events/e1/old.webp"),
      new Uint8Array(10),
      { contentType: "image/webp" },
    );
  });
}
