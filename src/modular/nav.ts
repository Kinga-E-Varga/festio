/** The header section's id: the page draws it apart from the others. */
export const HEADER_ID = "header";

/** ☰'s id, in every header variant: the drawer hands focus back to it on close. */
export const SECTIONS_TRIGGER_ID = "sections-trigger";

/** The reply form's section id: the page hands it the host's questions. */
export const RSVP_ID = "rsvp";

/** The most links the header's menu shows. */
export const MENU_MAX = 7;

/**
 * The sections with a menu link, most important first. The first seven
 * links are always listed while their sections are on; the rest fill what
 * spots are left, in this order. Helpful notes, Dress code and Gifts share
 * one link (Good to know, `GOOD_TO_KNOW`), one of the seven.
 */
export const MENU_RANK = [
  "date-time",
  "location",
  "schedule",
  "transportation",
  "accommodation",
  "notes",
  "dress-code",
  "gifts",
  "contact",
  "faq",
  "people",
  "menu",
  "story",
];
