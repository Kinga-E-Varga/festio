import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCards } from "@/db/reads/parse";
import type { GuestListDoc } from "@/db/schemas/guest-list";
import { replySchema } from "@/db/schemas/reply";
import { guestListOf } from "@/db/writes/counts";
import { toGuestReplies } from "@/lib/guests";
import type { DashboardEvent } from "@/types/dashboard";
import type { EventGuests } from "@/types/guests";

/** The event's pre-loaded names, one card; missing = none yet, at version 0. Once per request per event. */
export const readGuestList = cache(
  async (eventId: string): Promise<GuestListDoc> => {
    await connection();
    return guestListOf(await db.doc(paths.guestList(eventId)).get());
  },
);

/** The event's replies, oldest first, and its pre-loaded names; once per request per event. */
const readGuests = cache(
  async (eventId: string): Promise<Omit<EventGuests, "questions">> => {
    await connection();
    const [replies, list] = await Promise.all([
      db.collection(paths.replies(eventId)).orderBy("sentAt").get(),
      readGuestList(eventId),
    ]);
    return {
      list: list.names,
      listVersion: list.version,
      replies: toGuestReplies(parseCards(replySchema, replies.docs)),
    };
  },
);

/** The event's guest list as the page reads it, with the host's questions. */
export async function loadGuests(event: DashboardEvent): Promise<EventGuests> {
  return { ...(await readGuests(event.id)), questions: event.questions };
}
