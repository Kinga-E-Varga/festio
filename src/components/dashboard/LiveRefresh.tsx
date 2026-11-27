"use client";

import { useEffect, useRef } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "@/i18n/navigation";
import { paths } from "@/db/paths";
import { clientDb, hostUid } from "@/lib/firebase-live";
import { LIVE_REFRESH_QUIET_MS } from "@/lib/config";
import { eventStamp, stampWithoutData } from "@/lib/event-stamp";
import { isLive, onLiveStop } from "@/lib/live-events";

type Stamps = Record<string, { all: string; noData: string }>;

/** Each event's stamp; a live event's leaves out the replies part. */
function watched(stamps: Stamps) {
  return Object.fromEntries(
    Object.entries(stamps).map(([id, s]) => [
      id,
      isLive(id) ? s.noData : s.all,
    ]),
  );
}

function sameStamps(a: Stamps, b: Stamps) {
  const x = watched(a);
  const y = watched(b);
  const ids = Object.keys(x);
  return (
    ids.length === Object.keys(y).length && ids.every((id) => x[id] === y[id])
  );
}

/**
 * Listens to the host's event cards and, when one is added, gone or changed
 * from what the page shows, asks the server again. Draws nothing.
 */
export function LiveRefresh({ stamps }: { stamps: Stamps }) {
  const router = useRouter();
  // The latest stamps, so a host's own save (which already refreshes) is no news.
  const shown = useRef(stamps);
  useEffect(() => {
    shown.current = stamps;
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let latest: Stamps | undefined;
    let gone = false;

    /* After a quiet spell, refresh if the page differs from the latest cards. */
    function check() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        /* Compared when the timer fires: the host's own save may have refreshed the page meanwhile. */
        if (!latest || sameStamps(latest, shown.current)) return;
        router.refresh();
      }, LIVE_REFRESH_QUIET_MS);
    }
    /* A guest list closing leaves the events it hid to be compared again. */
    const stopListening = onLiveStop(check);

    void hostUid().then((uid) => {
      if (gone || !uid) return;
      const cards = query(
        collection(clientDb(), paths.events),
        where("hostId", "==", uid),
      );
      unsubscribe = onSnapshot(
        cards,
        (snapshot) => {
          const live: Stamps = {};
          snapshot.forEach((card) => {
            const { version, dataVersion, invitationVersion } = card.data();
            const versions = { version, dataVersion, invitationVersion };
            live[card.id] = {
              all: eventStamp(versions),
              noData: stampWithoutData(versions),
            };
          });
          latest = live;
          clearTimeout(timer);
          check();
        },
        (error) => {
          console.error("Listening to the events failed", error);
          unsubscribe?.();
        },
      );
    });

    return () => {
      gone = true;
      stopListening();
      clearTimeout(timer);
      unsubscribe?.();
    };
  }, [router]);

  return null;
}
