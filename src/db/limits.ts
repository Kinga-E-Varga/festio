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

/** The longest name a host's account takes. */
export const HOST_NAME_MAX = 80;

/** The shortest password a host's account takes. */
export const ACCOUNT_PASSWORD_MIN = 8;

/** The longest name in a reply, guest's or host's. */
export const RSVP_NAME_MAX = 60;

/** The longest note a guest leaves the host. */
export const RSVP_NOTE_MAX = 300;

/** The longest text answer, and the longest Other diet. */
export const RSVP_ANSWER_MAX = 200;

/** The most people one reply answers for. */
export const RSVP_PEOPLE_MAX = 10;
