import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from "firebase/firestore";
import { firebaseToken } from "@/actions/auth";
import { clientApp, clientAuth } from "@/lib/firebase-client";
import firebaseConfig from "../../firebase.json";

/*
 * The browser's Firestore, for live updates. Kept apart from
 * `firebase-client.ts` so the pages that only sign in don't load Firestore.
 */

let clientDbInstance: Firestore | undefined;
let hostUidPromise: Promise<string | null> | undefined;
/** The uid `hostUidPromise` settled on; none while it is still pending. */
let settledUid: string | undefined;
/** Bumped by every `forgetHostUid`, so an older sign-in can tell it is stale. */
let hostGeneration = 0;
let watching = false;

/** One Firestore per tab; on `npm run dev` it talks to the local emulator. */
export function clientDb(): Firestore {
  if (clientDbInstance) return clientDbInstance;
  clientDbInstance = getFirestore(clientApp());
  if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
    connectFirestoreEmulator(
      clientDbInstance,
      window.location.hostname,
      firebaseConfig.emulators.firestore.port,
    );
  }
  return clientDbInstance;
}

/*
 * The cookie is the truth about who the host is, so every tab signs in anew
 * with a token from the server, replacing whoever the browser had. A sign-in
 * that was started before a log out finishes into a newer generation and is
 * dropped.
 */
async function signInHost(generation: number): Promise<string | null> {
  const token = await firebaseToken();
  if (!token) return null;
  const { user } = await signInWithCustomToken(clientAuth(), token);
  if (generation !== hostGeneration) {
    await signOut(clientAuth());
    return null;
  }
  return user.uid;
}

/**
 * The signed-in host's uid in the browser's Firebase, or null (signed out:
 * no live updates). Signs in once per tab; a failed or empty try is forgotten
 * so the next call tries again.
 */
export function hostUid(): Promise<string | null> {
  if (!watching) {
    watching = true;
    /* Whoever signs in or out by any path, a settled uid for someone else is stale. */
    onAuthStateChanged(clientAuth(), (user) => {
      if (settledUid !== undefined && user?.uid !== settledUid) forgetHostUid();
    });
  }
  if (!hostUidPromise) {
    const generation = hostGeneration;
    const attempt = signInHost(generation).catch((error: unknown) => {
      console.error("Signing in the browser to Firebase failed", error);
      return null;
    });
    hostUidPromise = attempt;
    void attempt.then((uid) => {
      if (generation !== hostGeneration) return;
      if (uid === null) forgetHostUid();
      else settledUid = uid;
    });
  }
  return hostUidPromise;
}

/** Log out, or the user changed: the next `hostUid` signs in afresh. */
export function forgetHostUid(): void {
  hostGeneration += 1;
  hostUidPromise = undefined;
  settledUid = undefined;
}
