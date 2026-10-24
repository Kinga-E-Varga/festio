import { MEMO_MAX_ENTRIES, MEMO_TTL_MINUTES } from "@/lib/config";

type MemoOptions = {
  ttlMs?: number;
  maxEntries?: number;
  now?: () => number;
};

type Entry<T> = { value: T; setAt: number };

/**
 * A small in-memory cache, one per use, living as long as the server process.
 * An entry is gone `ttlMs` after it was set; past `maxEntries` the least
 * recently read or set goes first (`config.ts` sets both unless given).
 * Values are shared: never change them.
 */
export function createMemo<T>({
  ttlMs = MEMO_TTL_MINUTES * 60_000,
  maxEntries = MEMO_MAX_ENTRIES,
  now = Date.now,
}: MemoOptions = {}) {
  const entries = new Map<string, Entry<T>>();

  return {
    get(key: string): T | undefined {
      const entry = entries.get(key);
      if (!entry) return undefined;
      if (now() - entry.setAt > ttlMs) {
        entries.delete(key);
        return undefined;
      }
      entries.delete(key);
      entries.set(key, entry);
      return entry.value;
    },
    set(key: string, value: T): void {
      entries.delete(key);
      entries.set(key, { value, setAt: now() });
      while (entries.size > maxEntries) {
        const oldest = entries.keys().next().value;
        if (oldest === undefined) break;
        entries.delete(oldest);
      }
    },
    delete(key: string): void {
      entries.delete(key);
    },
  };
}
