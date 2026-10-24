"use server";

import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { loadRecentReplies } from "@/db/reads/activity";
import { eventsOfHost } from "@/db/reads/events";
import { requireHostId } from "@/db/reads/session";
import type { ActionResult } from "@/types/actions";
import type { RsvpActivity } from "@/types/dashboard";

/** The latest replies the side panel lists, across every event. */
const LATEST_REPLIES = 20;

/** The side panel's latest replies, read when it opens rather than with every page. */
export async function loadLatestReplies(): Promise<
  ActionResult<RsvpActivity[]>
> {
  /* Outside the `try`: signed out, its redirect must reach Next. One check, passed on: `cache` doesn't hold in an action. */
  const hostId = await requireHostId();
  try {
    const events = await eventsOfHost(hostId);
    return {
      success: true,
      data: await loadRecentReplies(hostId, events, LATEST_REPLIES),
    };
  } catch (error) {
    console.error("Loading the latest replies failed", error);
    return { success: false, error: "failed" };
  }
}

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
