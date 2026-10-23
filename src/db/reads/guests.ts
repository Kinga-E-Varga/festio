import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCards } from "@/db/reads/parse";
import { guestListNameSchema } from "@/db/schemas/guest-list";
import { replySchema } from "@/db/schemas/reply";
import { toGuestReplies } from "@/lib/guests";
import type { DashboardEvent } from "@/types/dashboard";
import type { EventGuests, ListName } from "@/types/guests";

/** The event's replies, oldest first, and its pre-loaded names; once per request per event. */
const readGuests = cache(
  async (eventId: string): Promise<Omit<EventGuests, "questions">> => {
    await connection();
    const [replies, names] = await Promise.all([
      db.collection(paths.replies(eventId)).orderBy("sentAt").get(),
      db.collection(paths.guestList(eventId)).get(),
    ]);
    const list: ListName[] = parseCards(guestListNameSchema, names.docs);
    return {
      list,
      replies: toGuestReplies(parseCards(replySchema, replies.docs)),
    };
  },
);

/** The event's guest list as the page reads it, with the host's questions. */
export async function loadGuests(event: DashboardEvent): Promise<EventGuests> {
  return { ...(await readGuests(event.id)), questions: event.questions };
}
