/*
 * The drawn covers' motion, shared: Champagne's and Birthday cake's. Each
 * plays a few times, about 20 seconds, then rests on a still frame
 * (`--animate-*` in `globals.css`), only for a guest who has not asked for
 * less motion (`motion-safe:`).
 */

/* An SVG part's own box for its motion, so it moves round its middle. */
export const OWN_BOX = "[transform-box:fill-box] origin-center";

/*
 * The motion waits while the page is inert, under the envelope (the
 * envelope's copy of the page too), and while the cover is out of view
 * (`data-paused`, set by `useOutOfView`). Forced, as the animation's own
 * shorthand comes later and would set it running.
 */
export const PAUSE =
  "in-[[inert]]:[animation-play-state:paused]! in-[[data-paused]]:[animation-play-state:paused]!";
