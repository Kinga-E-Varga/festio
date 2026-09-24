"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import {
  buildRows,
  countRows,
  filterGroup,
  groupRows,
  resolveFilter,
} from "@/lib/guests";
import type { EventGuests, GuestFilter, GuestGroup } from "@/types/guests";

/** The list, the view over it, and nothing that talks to the host. */
export function useGuestList(initial: EventGuests, preloaded: boolean) {
  const locale = useLocale();
  const [guests, setGuests] = useState(initial);
  const [useList, setUseList] = useState(preloaded);
  const [filter, setFilter] = useState<GuestFilter>("all");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const rows = buildRows(guests, useList);
  const counts = countRows(rows);
  const active = resolveFilter(filter, counts, useList);
  /* A chip that disappears takes its filter with it, so it can't come back on its own. */
  if (active !== filter) setFilter(active);
  const compare = new Intl.Collator(locale, { sensitivity: "base" }).compare;
  const groups: GuestGroup[] = groupRows(rows, compare).flatMap((group) => {
    const shown = filterGroup(group, active, query);
    return shown ? [shown] : [];
  });

  return {
    guests,
    rows,
    counts,
    groups,
    filter: active,
    query,
    useList,
    addOpen: useList && addOpen,
    waiting: rows.flatMap((row) => (row.kind === "waiting" ? [row.listName] : [])),
    set: { filter: setFilter, query: setQuery, useList: setUseList, addOpen: setAddOpen },
    openAddNames: () => {
      setUseList(true);
      setAddOpen(true);
    },
    edit: (recipe: (current: EventGuests) => EventGuests) => setGuests(recipe),
  };
}

export type GuestListState = ReturnType<typeof useGuestList>;
