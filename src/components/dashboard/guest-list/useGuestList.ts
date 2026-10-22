"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import {
  buildRows,
  countRows,
  filterGroup,
  groupRows,
  tallyGuests,
} from "@/lib/guests";
import type { EventGuests, GuestGroup } from "@/types/guests";

/** The list, the view over it, and nothing that talks to the host. */
export function useGuestList(initial: EventGuests, preloaded: boolean) {
  const locale = useLocale();
  const [guests, setGuests] = useState(initial);
  const [useList, setUseList] = useState(preloaded);
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

  return {
    guests,
    rows,
    counts,
    tally: tallyGuests(rows, guests.questions),
    groups,
    query,
    useList,
    addOpen: useList && addOpen,
    waiting: rows.flatMap((row) =>
      row.kind === "waiting" ? [row.listName] : [],
    ),
    set: {
      query: setQuery,
      useList: setUseList,
      addOpen: setAddOpen,
      keep: setKeep,
    },
    openAddNames: () => {
      setUseList(true);
      setAddOpen(true);
    },
    edit: (recipe: (current: EventGuests) => EventGuests) => setGuests(recipe),
  };
}

export type GuestListState = ReturnType<typeof useGuestList>;
