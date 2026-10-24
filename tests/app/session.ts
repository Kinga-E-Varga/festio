import { Timestamp } from "firebase-admin/firestore";
import { auth, db } from "@/db/admin";
import { paths } from "@/db/paths";
import { unlockCookie } from "@/db/reads/unlock";
import { unlockToken } from "@/db/secret";
import { userSchema } from "@/db/schemas/user";
import { TERMS_VERSION } from "@/lib/config";
import { SEED_HOST } from "../../seed/build";

/*
 * Signing in for the page tests: a real session cookie from the test Auth
 * emulator, the way `startSession` makes one, so the app checks it as usual.
 */

/** A second host with no events: for "another host's event is not found". */
export const OTHER_HOST = {
  uid: "host-other",
  email: "other@festio.test",
  password: "festio-other",
  name: "Other",
};

type Host = typeof SEED_HOST;

/** The host's login and `users` card, made once if missing. */
async function ensureHost(host: Host): Promise<void> {
  const exists = await auth.getUser(host.uid).then(
    () => true,
    () => false,
  );
  if (exists) return;
  await auth.createUser({
    uid: host.uid,
    email: host.email,
    password: host.password,
    displayName: host.name,
    emailVerified: true,
  });
  const card = userSchema.parse({
    name: host.name,
    language: "en",
    joinedAt: Timestamp.now(),
    terms: { version: TERMS_VERSION, acceptedAt: Timestamp.now() },
  });
  await db.doc(paths.user(host.uid)).set(card);
}

/** An ID token from the Auth emulator's own sign-in, as the browser would get one. */
async function idToken(host: Host): Promise<string> {
  const url = `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
  const answer = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: host.email,
      password: host.password,
      returnSecureToken: true,
    }),
  });
  if (!answer.ok) throw new Error(`Signing in ${host.email} failed`);
  return ((await answer.json()) as { idToken: string }).idToken;
}

/* `SESSION_COOKIE` (`src/db/reads/session.ts`); importing it loads Next's navigation, which tests can't. */
const SESSION_COOKIE = "__session";

async function signIn(host: Host): Promise<string> {
  await ensureHost(host);
  const session = await auth.createSessionCookie(await idToken(host), {
    expiresIn: 60 * 60 * 1000,
  });
  return `${SESSION_COOKIE}=${session}`;
}

/* An hour's session: made once per host per test file. */
const cookies = new Map<string, Promise<string>>();

/** The `Cookie` header that signs this host in. */
export function hostCookie(host: Host): Promise<string> {
  const cookie = cookies.get(host.uid) ?? signIn(host);
  cookies.set(host.uid, cookie);
  return cookie;
}

/** The `Cookie` header of a browser that typed this Protected event's password. */
export function unlockHeader(event: {
  id: string;
  event: { slug: string; password?: string };
}): string {
  const token = unlockToken(event.id, event.event.password ?? "");
  return `${unlockCookie(event.event.slug)}=${token}`;
}
