"use client";

import { useState } from "react";
import type { ListName } from "@/types/guests";

/** The preloaded list as the host edits it: nothing reaches the list until they save. */
export function useListDraft(list: ListName[]) {
  const [added, setAdded] = useState<ListName[]>([]);
  const [removed, setRemoved] = useState<ReadonlySet<string>>(new Set());

  function add(names: string[]) {
    const batch = names.map((name) => ({ id: crypto.randomUUID(), name, sent: false }));
    setAdded((current) => [...current, ...batch]);
  }

  function remove(id: string) {
    if (added.some((entry) => entry.id === id)) {
      setAdded((current) => current.filter((entry) => entry.id !== id));
    } else {
      setRemoved((current) => new Set(current).add(id));
    }
  }

  return {
    names: [...added, ...list.filter((entry) => !removed.has(entry.id))],
    added,
    removedIds: [...removed],
    changed: added.length > 0 || removed.size > 0,
    add,
    remove,
  };
}
