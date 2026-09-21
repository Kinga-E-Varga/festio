/**
 * How far into Festio the current history entry is.
 *
 * `router.back()` is a blind step: the App Router tags its own entries but
 * keeps no depth counter, and `document.referrer` never updates across a
 * client-side navigation, so nothing on the page can say whether the entry
 * behind this one is still ours or the site the host came from.
 *
 * So we count. Every entry is stamped with the number of Festio pages behind
 * it, and the stamp rides in `history.state`, which survives both a reload
 * and a back/forward — a counter in memory would not. A stamped entry is one
 * we have stood on before and its own number is the truth; an unstamped one
 * is a push that just happened, which puts exactly one more of our pages
 * behind us. The document's first entry is the exception: whatever precedes
 * it is not ours.
 */

const KEY = 'festioDepth'

let depth = 0
let started = false

/** Call on every navigation. Stamps the entry and reads where we now are. */
export function trackHistoryEntry() {
  if (typeof window === 'undefined') return

  const state = (window.history.state ?? null) as Record<string, unknown> | null
  const stamped = state?.[KEY]

  if (typeof stamped === 'number') {
    depth = stamped
    started = true
    return
  }

  depth = started ? depth + 1 : 0
  started = true

  /*
   * Spread rather than replace: `__NA` and the router's own tree live in
   * this object, and dropping them would strand the App Router on this entry.
   */
  window.history.replaceState({ ...state, [KEY]: depth }, '')
}

/**
 * Whether stepping back lands on a Festio page rather than off the site.
 *
 * Only ever errs by overestimating, and it cannot err into leaving: an entry
 * we failed to stamp is still one this app created, so every entry above the
 * document's first is ours by construction.
 */
export function hasFestioHistory() {
  return depth > 0
}
