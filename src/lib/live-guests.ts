import { parseCards } from "@/db/reads/parse";
import { guestListSchema } from "@/db/schemas/guest-list";
import { replySchema } from "@/db/schemas/reply";
import { toGuestReplies } from "@/lib/guests";
import type { EventGuests } from "@/types/guests";

/** The reply cards a listener hands over, in the shape `parseCards` takes. */
export type ReplyCards = Parameters<typeof parseCards>[1];

/**
 * The guest list as the browser's two listeners saw it: the reply cards
 * (any order) and the list card's data (`undefined` when missing). The same
 * shape the page reads (`loadGuests`); a card failing its schema is left out.
 */
export function liveGuests(
  replies: ReplyCards,
  list: unknown,
  questions: EventGuests["questions"],
): EventGuests {
  const parsed = guestListSchema.safeParse(list);
  const names = parsed.success ? parsed.data : { names: [], version: 0 };
  const stored = parseCards(replySchema, replies).sort(
    (a, b) => a.sentAt.toDate().getTime() - b.sentAt.toDate().getTime(),
  );
  return {
    list: names.names,
    listVersion: names.version,
    replies: toGuestReplies(stored),
    questions,
  };
}
