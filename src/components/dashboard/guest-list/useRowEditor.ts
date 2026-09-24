"use client";

import { useState } from "react";
import { NEW_ROW, openRow } from "@/lib/guests";
import type { GuestRow } from "@/types/guests";

export { NEW_ROW };

/**
 * One row in edit mode at a time. Anything that would leave the open row
 * while it has changes (another row, Add names, the list toggle) waits until
 * the host discards or keeps editing.
 */
export function useRowEditor(rows: GuestRow[]) {
  const [held, setEditing] = useState<string | null>(null);
  const editing = openRow(held, rows);
  const [dirty, setDirty] = useState(false);
  /* Wrapped in a function when set: a bare function would be taken as an updater. */
  const [pending, setPending] = useState<(() => void) | null>(null);

  function guard(action: () => void) {
    if (editing !== null && dirty) {
      setPending(() => action);
      return;
    }
    action();
  }

  function open(id: string) {
    if (editing === id) return;
    guard(() => {
      setEditing(id);
      setDirty(false);
      setPending(null);
    });
  }

  function close() {
    setEditing(null);
    setDirty(false);
    setPending(null);
  }

  function discard() {
    const action = pending;
    close();
    action?.();
  }

  return {
    editing,
    open,
    close,
    guard,
    reportDirty: setDirty,
    pendingPrompt:
      pending === null ? null : { onDiscard: discard, onKeep: () => setPending(null) },
  };
}

export type RowEditorState = ReturnType<typeof useRowEditor>;
