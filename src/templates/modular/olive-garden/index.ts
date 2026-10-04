import type { ModularTemplate } from "@/types/modular";

/**
 * Dark Olive and Gelasio + Arimo on a plain ground: every section but the
 * standalone Dress code and Gifts — Helpful notes shows both.
 */
export const template: ModularTemplate = {
  kind: "modular",
  id: "olive-garden",
  name: "Olive Garden",
  package: "custom",
  eventTypes: ["wedding"],
  palette: "dark-olive",
  fontPair: "gelasio-arimo",
  sections: [
    { section: "top-bar", variant: "monogram" },
    { section: "cover", variant: "photo" },
    { section: "title", variant: "names" },
    { section: "date-time", variant: "calendar-card" },
    { section: "countdown", variant: "ticking" },
    { section: "location", variant: "venue-photo" },
    { section: "schedule", variant: "days" },
    { section: "transportation", variant: "cards" },
    { section: "accommodation", variant: "stays" },
    { section: "menu", variant: "courses" },
    { section: "notes", variant: "cards" },
    { section: "faq", variant: "split" },
    { section: "playlist", variant: "record" },
    { section: "rsvp", variant: "split" },
    { section: "footer", variant: "monogram" },
  ],
};
