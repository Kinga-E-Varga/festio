"use client";

import { useLocale } from "next-intl";
import { useRef, useState } from "react";
import { saveGuestChanges, saveGuestListOn } from "@/actions/guests";
import type { SaveError } from "@/db/writes/save";
import { orFailed } from "@/lib/action";
import {
  buildRows,
  countRows,
  filterGroup,
  groupRows,
  guestChanges,
  hasChanges,
  tallyGuests,
} from "@/lib/guests";
import {
  dropList,
  keepList,
  keptList,
  type SavedList,
} from "@/lib/saved-lists";
import type { EventGuests, GuestGroup } from "@/types/guests";

/** The state to start from: the tab's last save, unless the page is newer (a guest reply, another device), which wins and drops it. */
function startFrom(
  eventId: string,
  initial: EventGuests,
  dataVersion: number,
  preloaded: boolean,
): Omit<SavedList, "listVersion"> {
  const kept = keptList(eventId);
  if (
    kept &&
    dataVersion <= kept.dataVersion &&
    initial.listVersion <= kept.listVersion
  )
    return kept;
  dropList(eventId);
  return { dataVersion, guests: initial, useList: preloaded };
}

/**
 * The list, the view over it, and its saves; nothing that talks to the host
 * but `fail`, told why a save was turned down.
 */
export function useGuestList(
  eventId: string,
  initial: EventGuests,
  preloaded: boolean,
  dataVersion: number,
  fail: (error: SaveError) => void,
) {
  const locale = useLocale();
  const [start] = useState(() =>
    startFrom(eventId, initial, dataVersion, preloaded),
  );
  const [guests, setGuests] = useState(start.guests);
  const [useList, setUseList] = useState(start.useList);
  /* The list as last saved: the next save starts from it. */
  const saved = useRef(start.guests);
  /* The data version the list started from, then the one the last save left. */
  const version = useRef(start.dataVersion);
  const listOn = useRef(start.useList);
  /* One save at a time: a second click while one runs is ignored. */
  const busy = useRef(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  /* The row open in the editor: a search never hides it mid-edit. */
  const [keep, setKeep] = useState<string | null>(null);

  const rows = buildRows(guests, useList);
  const counts = countRows(rows);
  const compare = new Intl.Collator(locale, { sensitivity: "base" }).compare;
  const groups: GuestGroup[] = groupRows(rows, compare).flatMap((group) => {
    const shown = filterGroup(group, query, keep);
    return shown ? [shown] : [];
  });

  /** Keeps the saved state for a mount that starts from an older page. */
  function remember() {
    keepList(eventId, {
      dataVersion: version.current,
      listVersion: saved.current.listVersion,
      guests: saved.current,
      useList: listOn.current,
    });
  }

  /** Runs one save unless another is running; false when it didn't save. */
  async function once(run: () => Promise<boolean>): Promise<boolean> {
    if (busy.current) return false;
    busy.current = true;
    setSaving(true);
    try {
      return await run();
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  /** Saves what `recipe` changes, then shows it; false when it wasn't saved. */
  async function save(
    recipe: (current: EventGuests) => EventGuests,
  ): Promise<boolean> {
    const before = saved.current;
    const next = recipe(before);
    const changes = guestChanges(before, next);
    if (!hasChanges(changes)) return true;
    const result = await orFailed(saveGuestChanges(eventId, changes));
    if (!result.success) {
      fail(result.error);
      return false;
    }
    saved.current = { ...next, listVersion: result.data.listVersion };
    version.current = result.data.dataVersion;
    remember();
    setGuests(saved.current);
    return true;
  }

  function apply(recipe: (current: EventGuests) => EventGuests) {
    return once(() => save(recipe));
  }

  /** The list switch, saved as the event's own before it shows. */
  function switchList(on: boolean): Promise<boolean> {
    return once(async () => {
      const result = await orFailed(saveGuestListOn(eventId, on));
      if (!result.success) {
        fail(result.error);
        return false;
      }
      listOn.current = on;
      remember();
      setUseList(on);
      return true;
    });
  }

  return {
    guests,
    rows,
    counts,
    tally: tallyGuests(rows, guests.questions),
    groups,
    query,
    useList,
    /** A save is on its way: Save buttons wait for it. */
    saving,
    addOpen: useList && addOpen,
    waiting: rows.flatMap((row) =>
      row.kind === "waiting" ? [row.listName] : [],
    ),
    set: {
      query: setQuery,
      useList: switchList,
      addOpen: setAddOpen,
      keep: setKeep,
    },
    /* With the list off, the box turns it on first. */
    openAddNames: async () => {
      if (!useList && !(await switchList(true))) return;
      setAddOpen(true);
    },
    apply,
  };
}

export type GuestListState = ReturnType<typeof useGuestList>;
