import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import firebaseConfig from "../../firebase.json";

/*
 * The server's way into Firebase (Admin SDK). It skips security rules, so
 * every caller checks access itself.
 */

/** Set in `.env.development`: talk to the local emulators, never a real project. */
export const USE_EMULATORS = process.env.NEXT_PUBLIC_USE_EMULATORS === "true";

/**
 * The Admin SDK finds the emulators through these variables. The ports are
 * read from `firebase.json`, so they're written in one place.
 */
function pointAtEmulators() {
  const { auth, firestore, storage } = firebaseConfig.emulators;
  process.env.FIRESTORE_EMULATOR_HOST ??= `127.0.0.1:${firestore.port}`;
  process.env.FIREBASE_AUTH_EMULATOR_HOST ??= `127.0.0.1:${auth.port}`;
  process.env.FIREBASE_STORAGE_EMULATOR_HOST ??= `127.0.0.1:${storage.port}`;
  /* Not on Google Cloud: don't go looking for its credentials server. */
  process.env.METADATA_SERVER_DETECTION ??= "none";
}

/** One app per server process, also across dev hot reloads. */
const fresh = getApps().length === 0;
if (fresh && USE_EMULATORS) pointAtEmulators();
const app =
  getApps()[0] ??
  initializeApp(
    USE_EMULATORS
      ? {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          /* The Storage emulator takes any bucket name; this is the default one's. */
          storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
        }
      : undefined,
  );

/** Optional fields left `undefined` are simply not written: missing = never asked. */
export const db = getFirestore(app);
if (fresh) db.settings({ ignoreUndefinedProperties: true });

export const auth = getAuth(app);

/** Host uploads, one folder per event, in the default bucket (`storage.bucket()`). */
export const storage = getStorage(app);
