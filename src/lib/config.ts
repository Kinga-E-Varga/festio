/**
 * Days after the event date when an invitation and all of its guest data are
 * deleted automatically (GDPR). This is the single source of truth for the
 * retention window — read it from here, never inline the number.
 */
export const GUEST_DATA_RETENTION_DAYS = 30;

/**
 * The hidden reply cap sits above the host's expected guests by the larger of
 * these two: a share of the expected number, or a flat number of people.
 */
export const REPLY_CAP_MARGIN = 0.5;
export const REPLY_CAP_MIN_EXTRA = 20;

/** Percent of expected guests at which replies read as a warning. */
export const EXPECTED_WARNING_PERCENT = 80;

/** Days before the reply form closes at which the host is warned. */
export const REPLIES_CLOSING_SOON_DAYS = 7;
