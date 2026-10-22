/**
 * Where each card lives in Firestore. The one place collection names are
 * written; see `context/features/pending/database.md` → Data.
 */
export const paths = {
  user: (uid: string) => `users/${uid}`,
  event: (eventId: string) => `events/${eventId}`,
  invitation: (eventId: string) => `events/${eventId}/invitation/content`,
  replies: (eventId: string) => `events/${eventId}/replies`,
  guestList: (eventId: string) => `events/${eventId}/guestList`,
  seating: (eventId: string) => `events/${eventId}/seating/chart`,
  slug: (slug: string) => `slugs/${slug}`,
  payments: "payments",
};
