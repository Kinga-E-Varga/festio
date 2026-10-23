"use server";

import { cookies } from "next/headers";
import { eventIdBySlug, loadEventBySlug } from "@/db/reads/events";
import { PRIVATE_COOKIE } from "@/db/reads/session";
import { readUnlock, unlockCookie } from "@/db/reads/unlock";
import { visitorKey } from "@/db/reads/visitor";
import { unlockToken } from "@/db/secret";
import { guestReplySchema, type GuestReplyInput } from "@/db/schemas/reply";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { unlockAttempt } from "@/db/writes/rate-limit";
import { refusal, type SaveError } from "@/db/writes/save";
import { DAY_MS } from "@/lib/event";
import { UNLOCK_DAYS } from "@/lib/config";
import type { ActionResult } from "@/types/actions";

/*
 * The guest's actions. No sign-in: anyone with the link can call them, so
 * every rule is checked here or in the write, never trusted from the page.
 */

/**
 * Opens a Protected invitation in this browser when the password is right.
 * Any other link (unknown, not Protected) answers as a wrong password, so
 * nothing about it is given away. Setting the cookie reloads the page.
 */
export async function unlockInvitation(
  slug: string,
  password: string,
): Promise<ActionResult<undefined, "wrong" | "tooMany" | "failed">> {
  if (typeof slug !== "string" || typeof password !== "string") {
    return { success: false, error: "wrong" };
  }
  try {
    const event = await loadEventBySlug(slug);
    if (!event || event.visibility !== "protected" || !event.password) {
      return { success: false, error: "wrong" };
    }
    const correct = password.trim() === event.password;
    const result = await unlockAttempt(
      event.id,
      await visitorKey(),
      correct,
      new Date(),
    );
    if (result !== "ok") return { success: false, error: result };

    (await cookies()).set(
      unlockCookie(slug),
      unlockToken(event.id, event.password),
      { ...PRIVATE_COOKIE, maxAge: (UNLOCK_DAYS * DAY_MS) / 1000 },
    );
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Opening a Protected invitation failed", error);
    return { success: false, error: "failed" };
  }
}

/**
 * Sends a guest's reply to the invitation at this link. Whether it may be
 * saved (visibility, password, closing time, limit, cap) is all checked in
 * the write's transaction. Nothing on the page changes but the panel, so no
 * refresh.
 */
export async function sendReply(
  slug: string,
  input: GuestReplyInput,
): Promise<ActionResult<undefined, SaveError>> {
  const parsed = guestReplySchema.safeParse(input);
  if (typeof slug !== "string" || !parsed.success) {
    return { success: false, error: "invalid" };
  }
  try {
    /* Only the link's card: the write reads the event itself, and checks it still has this link. */
    const eventId = await eventIdBySlug(slug);
    if (!eventId) return { success: false, error: "notFound" };
    const visitor = { key: await visitorKey(), unlock: await readUnlock(slug) };
    await writeGuestReply(eventId, slug, parsed.data, visitor, new Date());
    return { success: true, data: undefined };
  } catch (error) {
    return refusal(error);
  }
}
