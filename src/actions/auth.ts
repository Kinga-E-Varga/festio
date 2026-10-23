"use server";

import { Timestamp } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { auth, db } from "@/db/admin";
import { paths } from "@/db/paths";
import { FRESH_SIGN_IN_SECONDS, SESSION_COOKIE } from "@/db/reads/session";
import { HOST_NAME_MAX } from "@/db/limits";
import { languageSchema } from "@/db/schemas/common";
import { userSchema } from "@/db/schemas/user";
import { redirect } from "@/i18n/navigation";
import { SESSION_DAYS, TERMS_VERSION } from "@/lib/config";
import { DAY_MS } from "@/lib/event";
import type { Language } from "@/lib/language";
import type { ActionResult } from "@/types/actions";

/** gRPC's ALREADY_EXISTS, what `create()` throws when the card is there. */
const ALREADY_EXISTS = 6;

const sessionInputSchema = z.object({
  idToken: z.string().min(1),
  /** The host's app language right now, saved on a new card. */
  language: languageSchema,
  acceptedTerms: z.boolean(),
  /** Typed on sign-up; Google gives its own. */
  name: z.string().trim().min(1).max(HOST_NAME_MAX).optional(),
});

type SessionInput = z.infer<typeof sessionInputSchema>;

/**
 * Why a session wasn't started: a new account that hasn't accepted the
 * Terms yet, a sign-in too old to trust, or anything else.
 */
type SessionError = "terms" | "stale" | "failed";

/** A new host's `users` card, with the Terms version they accepted just now. */
async function createUserCard(uid: string, name: string, language: Language) {
  const now = Timestamp.now();
  const card = userSchema.parse({
    name,
    language,
    joinedAt: now,
    terms: { version: TERMS_VERSION, acceptedAt: now },
  });
  try {
    await db.doc(paths.user(uid)).create(card);
  } catch (error) {
    /* Another tab got there first: the card exists, which is all that's needed. */
    if ((error as { code?: unknown }).code !== ALREADY_EXISTS) throw error;
  }
}

/**
 * Turns a browser sign-in (its ID token) into the host's session cookie.
 * A host without a `users` card gets one here, once they've accepted the
 * Terms; until then there is no session.
 */
export async function startSession(
  input: SessionInput,
): Promise<ActionResult<undefined, SessionError>> {
  const parsed = sessionInputSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "failed" };
  const { idToken, language, acceptedTerms, name } = parsed.data;

  try {
    /* No revocation check: the token is seconds old, and `createSessionCookie` checks it again. */
    const decoded = await auth.verifyIdToken(idToken);
    if (Date.now() / 1000 - decoded.auth_time > FRESH_SIGN_IN_SECONDS) {
      return { success: false, error: "stale" };
    }

    const card = await db.doc(paths.user(decoded.uid)).get();
    if (!card.exists) {
      if (!acceptedTerms) return { success: false, error: "terms" };
      /* Google's name, or the one saved on the login at sign-up, cut to fit. */
      const fallback = (
        (decoded.name as string | undefined)?.trim() ||
        decoded.email?.split("@")[0] ||
        "Host"
      ).slice(0, HOST_NAME_MAX);
      await createUserCard(decoded.uid, name ?? fallback, language);
    }

    const expiresIn = SESSION_DAYS * DAY_MS;
    const session = await auth.createSessionCookie(idToken, { expiresIn });
    (await cookies()).set(SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Starting a session failed", error);
    return { success: false, error: "failed" };
  }
}

/** Ends this browser's session and leaves for the landing page. */
export async function signOut(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect({ href: "/", locale: await getLocale() });
}
