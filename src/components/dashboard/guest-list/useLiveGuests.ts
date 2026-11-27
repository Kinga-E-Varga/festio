"use client";

import { useEffect, useEffectEvent } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { clientDb, hostUid } from "@/lib/firebase-live";
import { markLive } from "@/lib/live-events";
import { paths } from "@/db/paths";
import { liveGuests, type ReplyCards } from "@/lib/live-guests";
import type { EventGuests } from "@/types/guests";

/**
 * Listens to the event's replies and pre-loaded names and, once both have
 * answered and on every change after, hands the list as it now stands to
 * `onChange`. The replies are asked for by `hostId`, which the rules need.
 */
export function useLiveGuests(
  eventId: string,
  questions: EventGuests["questions"],
  onChange: (guests: EventGuests) => void,
) {
  /* Reads the latest `questions` and `onChange` without listening again. */
  const send = useEffectEvent((replies: ReplyCards, list: unknown) =>
    onChange(liveGuests(replies, list, questions)),
  );

  useEffect(() => {
    const stops: (() => void)[] = [markLive(eventId)];
    let gone = false;
    let replies: ReplyCards | undefined;
    /* The list card's data; `undefined` both before it answers and when it's missing. */
    let list: unknown;
    let listAnswered = false;

    function stop() {
      stops.forEach((unsubscribe) => unsubscribe());
    }
    function fail(error: Error) {
      console.error("Listening to the guest list failed", error);
      stop();
    }
    function tell() {
      if (gone || !replies || !listAnswered) return;
      send(replies, list);
    }

    void hostUid().then((uid) => {
      if (gone || !uid) return;
      const db = clientDb();
      stops.push(
        onSnapshot(
          query(
            collection(db, paths.replies(eventId)),
            where("hostId", "==", uid),
          ),
          (snapshot) => {
            if (snapshot.metadata.hasPendingWrites) return;
            replies = snapshot.docs;
            tell();
          },
          fail,
        ),
        onSnapshot(
          doc(db, paths.guestList(eventId)),
          (snapshot) => {
            if (snapshot.metadata.hasPendingWrites) return;
            list = snapshot.data();
            listAnswered = true;
            tell();
          },
          fail,
        ),
      );
    });

    return () => {
      gone = true;
      stop();
    };
  }, [eventId]);
}
