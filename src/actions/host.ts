"use server";

import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { requireHostId } from "@/db/reads/session";
import type { ActionResult } from "@/types/actions";

/** Marks the latest replies as seen now: the badge counts guests' replies after this. */
export async function markRepliesSeen(): Promise<ActionResult> {
  const hostId = await requireHostId();
  try {
    await db.doc(paths.user(hostId)).update({ lastVisit: Timestamp.now() });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Marking replies seen failed", error);
    return { success: false, error: "failed" };
  }
}
