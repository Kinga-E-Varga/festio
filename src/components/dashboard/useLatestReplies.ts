"use client";

import { useRef, useState } from "react";
import { loadLatestReplies } from "@/actions/host";
import type { RsvpActivity } from "@/types/dashboard";

export interface LatestReplies {
  /** Null until the first load comes back; then kept, so reopening shows it at once. */
  entries: RsvpActivity[] | null;
  /** The last load failed. */
  failed: boolean;
  /** Asks the server for the latest replies, unless a load is already on its way. */
  load: () => Promise<void>;
}

/**
 * The side panel's latest replies, loaded when it opens instead of with
 * every page. Held by the shell, so they outlive the panel's other views.
 */
export function useLatestReplies(): LatestReplies {
  const [entries, setEntries] = useState<RsvpActivity[] | null>(null);
  const [failed, setFailed] = useState(false);
  const loading = useRef(false);

  async function load() {
    if (loading.current) return;
    loading.current = true;
    /* A retry after a failure shows the skeleton again, not the old error. */
    setFailed(false);
    try {
      const result = await loadLatestReplies();
      if (result.success) setEntries(result.data);
      setFailed(!result.success);
    } catch {
      setFailed(true);
    } finally {
      loading.current = false;
    }
  }

  return { entries, failed, load };
}
