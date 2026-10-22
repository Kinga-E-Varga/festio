/*
 * The event card's value list and limits, without Zod, so client forms can
 * import them without shipping Zod to the browser. The schemas read them too.
 */

/** Keys into the `Occasions` message namespace, in the order they are offered. */
export const EVENT_KINDS = [
  "wedding",
  "engagement",
  "bachelorParty",
  "christening",
  "birthday",
  "kidsParty",
  "dinnerParty",
  "reunion",
  "other",
] as const;

/** The shortest event name, spaces at either end not counted. */
export const TITLE_MIN = 3;
export const TITLE_MAX = 80;

/** A Protected invitation's password: at least 4 letters or digits. */
export const PASSWORD_PATTERN = /^[A-Za-z0-9]{4,}$/;

/** The longest message a cancelled invitation shows. */
export const CANCEL_MESSAGE_MAX = 300;
