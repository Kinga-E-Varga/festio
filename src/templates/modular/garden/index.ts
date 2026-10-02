import type { ModularTemplate } from "@/types/modular";

/** Terracotta and Classic on dots, every phase-1 section on, in the fixed order. */
export const template: ModularTemplate = {
  kind: "modular",
  id: "garden",
  name: "Garden",
  package: "custom",
  eventTypes: ["wedding"],
  palette: "terracotta",
  fontPair: "classic",
  pattern: "dots",
  sections: [
    { section: "top-bar", variant: "classic" },
    { section: "cover", variant: "full-bleed" },
    { section: "title", variant: "editorial" },
    { section: "date-time", variant: "moments" },
    { section: "countdown", variant: "big-number" },
    { section: "location", variant: "details" },
    { section: "map", variant: "legend" },
    { section: "schedule", variant: "timeline" },
    { section: "dress-code", variant: "guidance" },
    { section: "menu", variant: "card" },
    { section: "gifts", variant: "bank-card" },
    { section: "playlist", variant: "record" },
    { section: "accommodation", variant: "list" },
    { section: "transportation", variant: "ways" },
    { section: "faq", variant: "accordion" },
    { section: "rsvp", variant: "simple" },
  ],
};
