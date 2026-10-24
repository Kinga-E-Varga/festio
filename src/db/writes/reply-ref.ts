import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import type { Person, ReplyDoc } from "@/db/schemas/reply";
import { normalizeName } from "@/lib/guests";

/**
 * Two fields every reply card is stored with, beside its content: its
 * people's names normalized (`normalizeName`), and the list names the host
 * matched them to. Only for finding the cards that decide how a name counts
 * and is tagged (`readNameGroup`); the pages never read them.
 */
export interface ReplyKeys {
  nameKeys: string[];
  listNameIds: string[];
}

export function replyKeys(people: Person[]): ReplyKeys {
  return {
    nameKeys: [...new Set(people.map((person) => normalizeName(person.name)))],
    listNameIds: [
      ...new Set(people.flatMap((person) => person.listNameId ?? [])),
    ],
  };
}

/**
 * Adds the keys and the event's host on every write, so no writer can forget
 * them. The host's ID lets the latest replies find a host's replies across
 * events in one query (`latestReplies`).
 */
function replyConverter(hostId: string): FirestoreDataConverter<ReplyDoc> {
  return {
    toFirestore(reply): DocumentData {
      const card = reply as ReplyDoc;
      return { ...card, ...replyKeys(card.people), hostId };
    },
    /* Reads go through `parseCards`; through this ref only `exists` is asked. */
    fromFirestore(snapshot: QueryDocumentSnapshot): ReplyDoc {
      return snapshot.data() as ReplyDoc;
    },
  };
}

/** A reply card of `hostId`'s event to write or delete: every write of one goes through here. */
export function replyRef(eventId: string, replyId: string, hostId: string) {
  return db
    .doc(paths.reply(eventId, replyId))
    .withConverter(replyConverter(hostId));
}
