"use client";

import { useState } from "react";
import { NEW_ROW, openRow } from "@/lib/guests";
import type { GuestRow } from "@/types/guests";

export { NEW_ROW };

/**
 * One row in edit mode at a time. Anything that would leave the open row
 * while it has changes (another row, Add names, the list toggle) waits until
 * the host discards or keeps editing. `hold` is the next check in line (the
 * list box's own), passed each action once the open row lets it through.
 */
export function useRowEditor(
  rows: GuestRow[],
  onEditing: (id: string | null) => void,
  hold: (action: () => void) => void,
) {
  const [held, setHeld] = useState<string | null>(null);
  function setEditing(id: string | null) {
    setHeld(id);
    onEditing(id);
  }
  const editing = openRow(held, rows);
  const [dirty, setDirty] = useState(false);
  /* Wrapped in a function when set: a bare function would be taken as an updater. */
  const [pending, setPending] = useState<(() => void) | null>(null);

  function guard(action: () => void) {
    if (editing !== null && dirty) {
      setPending(() => action);
      return;
    }
    hold(action);
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
    if (action) hold(action);
  }

  return {
    editing,
    /** Changes waiting on the open row: leaving the page asks first. */
    unsaved: editing !== null && dirty,
    open,
    close,
    guard,
    reportDirty: setDirty,
    pendingPrompt:
      pending === null
        ? null
        : { onDiscard: discard, onKeep: () => setPending(null) },
  };
}

export type RowEditorState = ReturnType<typeof useRowEditor>;
