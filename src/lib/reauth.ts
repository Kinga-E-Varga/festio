import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import type { HostLogin } from "@/db/reads/host";
import { clientAuth } from "@/lib/firebase-client";

/**
 * Asks the host to prove it's them before a step that can't be undone: their
 * password, or Google's popup when they have no password. Returns the fresh
 * sign-in's ID token for the server to check. A wrong password or a closed
 * popup throws.
 */
export async function confirmIdentity(
  login: HostLogin,
  password?: string,
): Promise<string> {
  /* Google's window opens on the host's own account. */
  const google = new GoogleAuthProvider();
  google.setCustomParameters({ login_hint: login.email });
  const { user } = login.password
    ? await signInWithEmailAndPassword(
        clientAuth(),
        login.email,
        password ?? "",
      )
    : await signInWithPopup(clientAuth(), google);
  return user.getIdToken();
}
