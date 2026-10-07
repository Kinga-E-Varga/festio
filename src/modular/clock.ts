import { useSyncExternalStore } from "react";

/*
 * One 1-second tick for every countdown on the page, running only while
 * one is mounted. `useSyncExternalStore` keeps the server render and the
 * first client render equal (`null`), so the live numbers never trip
 * hydration; they appear on the first tick after.
 */
let now = Date.now();
const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (timer === undefined) {
    now = Date.now();
    timer = window.setInterval(() => {
      now = Date.now();
      for (const notify of listeners) notify();
    }, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

/** No ticks: for a clock that has nothing left to show. */
function still(): () => void {
  return () => {};
}

/**
 * Milliseconds since the epoch, updated every second; `null` on the server
 * and while hydrating. Once `until` has passed it stops ticking: nothing it
 * drives changes after that.
 */
export function useNow(until = Infinity): number | null {
  return useSyncExternalStore(
    now < until ? subscribe : still,
    () => now,
    () => null,
  );
}
