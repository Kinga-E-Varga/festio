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
import type { EventGuests, GuestGroup } from "@/types/guests";

/**
 * The list, the view over it, and its saves; nothing that talks to the host
 * but `fail`, told why a save was turned down.
 */
export function useGuestList(
  eventId: string,
  initial: EventGuests,
  preloaded: boolean,
  fail: (error: SaveError) => void,
) {
  const locale = useLocale();
  const [guests, setGuests] = useState(initial);
  const [useList, setUseList] = useState(preloaded);
  /* The list as last saved: the next save starts from it. */
  const saved = useRef(initial);
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
