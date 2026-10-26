import { getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  inMemoryPersistence,
  initializeAuth,
  browserPopupRedirectResolver,
  type Auth,
} from "firebase/auth";
import firebaseConfig from "../../firebase.json";

/*
 * The browser's way into Firebase Auth, for signing in only. The signed-in
 * user is kept in memory, never in the browser's storage: the server's
 * session cookie is what keeps the host signed in.
 */

let clientAuthInstance: Auth | undefined;

/** One Auth per tab; on `npm run dev` it talks to the local emulator. */
export function clientAuth(): Auth {
  if (clientAuthInstance) return clientAuthInstance;
  const app =
    getApps()[0] ??
    initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  clientAuthInstance = initializeAuth(app, {
    persistence: inMemoryPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });
  if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
    /*
     * At the address the page came from: `localhost` on the PC, its Wi-Fi
     * address on a phone (the emulator listens on every address there,
     * `firebase.json`).
     */
    const { port } = firebaseConfig.emulators.auth;
    const host = window.location.hostname;
    connectAuthEmulator(clientAuthInstance, `http://${host}:${port}`, {
      disableWarnings: true,
    });
  }
  return clientAuthInstance;
}
