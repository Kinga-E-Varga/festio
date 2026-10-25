/**
 * Days after the event date when an invitation and all of its guest data are
 * deleted automatically (GDPR). This is the single source of truth for the
 * retention window — read it from here, never inline the number.
 */
export const GUEST_DATA_RETENTION_DAYS = 60;

/**
 * The hidden reply cap sits above the host's expected guests by the larger of
 * these two: a share of the expected number, or a flat number of people.
 */
export const REPLY_CAP_MARGIN = 0.5;
export const REPLY_CAP_MIN_EXTRA = 20;

/** Days before the reply form closes at which the host is warned. */
export const REPLIES_CLOSING_SOON_DAYS = 7;

/** Days a deleted event's link stays blocked, so old printed cards never open a stranger's invitation. */
export const SLUG_BLOCK_DAYS = 365;

/** The Terms (with the DPA) a new host accepts; a new version can be asked for again. */
export const TERMS_VERSION = "2026-01";

/** How long a host stays signed in: Firebase's longest session cookie. */
export const SESSION_DAYS = 14;

/** Replies one visitor can send to one link in an hour; more get "too many tries". */
export const REPLY_LIMIT_PER_HOUR = 5;

/** Wrong passwords one visitor can try on one Protected link in an hour. */
export const PASSWORD_LIMIT_PER_HOUR = 10;

/** How long a browser keeps a Protected invitation open once its password is typed. */
export const UNLOCK_DAYS = 30;

/**
 * A host save counts only the replies its change can reach, found in rounds
 * (`readChangeGroup`). Past either limit it counts every reply instead.
 */
export const GROUP_MAX_ROUNDS = 3;
export const GROUP_MAX_NAMES = 300;

/** How long the server remembers a read it can reuse (a link, an invitation) before reading again. */
export const MEMO_TTL_MINUTES = 60;

/** Most entries one of those memories holds; past it the least recently used goes first. */
export const MEMO_MAX_ENTRIES = 1000;

/** The most questions a reply form asks, ours and the host's own; archived ones don't count. */
export const QUESTIONS_MAX = 10;
