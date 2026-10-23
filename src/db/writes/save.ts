import type { ActionResult } from "@/types/actions";

/**
 * Why a save was turned down: a key into the `SaveErrors` messages, so the
 * editor shows it in words.
 */
export type SaveError =
  | "stale"
  | "notFound"
  | "invalid"
  | "failed"
  | "slugTaken"
  | "dateLocked"
  | "expectedTooLow"
  | "closeTooLate"
  | "wrongPassword"
  | "notAllowed"
  /* A guest's reply only: their words are in `Rsvp`, not `SaveErrors`. */
  | "locked"
  | "closed"
  | "paused"
  | "tooMany";

/** Thrown inside a save to stop it with a reason; nothing it was about to write is written. */
export class SaveRefused extends Error {
  constructor(readonly reason: SaveError) {
    super(`Save refused: ${reason}`);
    this.name = "SaveRefused";
  }
}

/**
 * Stops a save made from an older copy of the card: someone saved it in
 * between. A card not written yet counts as version 0.
 */
export function expectVersion(
  stored: { version: number } | undefined,
  expected: number,
): void {
  if ((stored?.version ?? 0) !== expected) throw new SaveRefused("stale");
}

/** A failed save as an action's answer: its reason, or `failed` (logged) for anything unexpected. */
export function refusal(error: unknown): ActionResult<never, SaveError> {
  if (error instanceof SaveRefused) {
    return { success: false, error: error.reason };
  }
  console.error("A save failed", error);
  return { success: false, error: "failed" };
}
