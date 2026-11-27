/** Events whose guest list this page keeps live in the browser. */
const live = new Map<string, number>();
let onStop: (() => void) | undefined;

/** Marks an event as live; call the returned function (once counts) to unmark it. */
export function markLive(eventId: string): () => void {
  live.set(eventId, (live.get(eventId) ?? 0) + 1);
  let marked = true;
  return () => {
    if (!marked) return;
    marked = false;
    const count = (live.get(eventId) ?? 1) - 1;
    if (count <= 0) {
      live.delete(eventId);
      onStop?.();
    } else live.set(eventId, count);
  };
}

export function isLive(eventId: string): boolean {
  return live.has(eventId);
}

/** One listener is told when an event stops being live; returns its removal. */
export function onLiveStop(listener: () => void): () => void {
  onStop = listener;
  return () => {
    if (onStop === listener) onStop = undefined;
  };
}
