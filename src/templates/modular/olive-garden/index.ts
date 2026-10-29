import type { ModularTemplate } from "@/types/modular";

/**
 * Orchard and Gelasio + Arimo on a plain ground: every section but the
 * standalone Dress code and Gifts — Helpful notes shows both. Three
 * locations: the town hall, the church and the reception, and the cover
 * photo, from `DEFAULTS`.
 */
export const template: ModularTemplate = {
  kind: "modular",
  id: "olive-garden",
  name: "Olive Garden",
  package: "custom",
  eventTypes: ["wedding"],
  palette: "orchard",
  fontPair: "gelasio-arimo",
  sections: [
    { section: "header", variant: "1" }, // square
    { section: "cover", variant: "1" }, // full-box
    { section: "title", variant: "1" }, // colorful
    { section: "date-time", variant: "1" }, // big-day
    { section: "countdown", variant: "1" }, // plain
    { section: "location", variant: "1" }, // cards
    { section: "schedule", variant: "1" }, // icons
    { section: "transportation", variant: "1" }, // cards
    { section: "accommodation", variant: "1" }, // stays
    { section: "menu", variant: "1" }, // courses
    { section: "notes", variant: "1" }, // cards
    { section: "faq", variant: "1" }, // split
    { section: "playlist", variant: "1" }, // record
    { section: "rsvp", variant: "1" }, // split
    { section: "footer", variant: "1" }, // monogram
  ],
};
