import type { ModularTemplate } from "@/types/modular";

/**
 * Linen and Alegreya + Alegreya Sans on a plain ground, sharp corners, with
 * the Balanced accent header and footer. Its content is `DEFAULTS`, every
 * icon too, but quieter: no eyebrows or notes over the sections, no detail
 * under the locations, and the text box upright.
 */
export const template: ModularTemplate = {
  kind: "modular",
  id: "olive-garden",
  name: "Olive Garden",
  package: "custom",
  eventTypes: ["wedding"],
  palette: "linen",
  fontPair: "alegreya-alegreya-sans",
  sections: [
    { section: "header", variant: "5" }, // balanced accent
    { section: "cover", variant: "10" }, // date block
    { section: "textbox", variant: "13" }, // full card accent
    { section: "date-time", variant: "12" }, // simple
    { section: "story", variant: "1" }, // two-line
    { section: "location", variant: "3" }, // grid
    { section: "schedule", variant: "1" }, // two-line & list
    { section: "transportation", variant: "6" }, // grid
    { section: "accommodation", variant: "1" }, // two-line & list
    { section: "notes", variant: "1" }, // wide cards
    { section: "contact", variant: "3" }, // two-line & list
    { section: "playlist", variant: "4" }, // card accent
    { section: "rsvp", variant: "1" }, // two-line & soft band
    { section: "footer", variant: "4" }, // balanced accent
  ],
  values: {
    // The text box's default text, upright.
    textbox: { italic: false },
    "date-time": { note: "" },
    story: { eyebrow: "" },
    location: {
      eyebrow: "",
      note: "",
      // The defaults' three venues, without their detail lines.
      venues: [
        {
          icon: "rings",
          label: {
            en: "Civil ceremony",
            ro: "Cununia civilă",
            hu: "Polgári szertartás",
          },
          venue: "Hôtel de Ville de Cassis",
          address: "Place Baragnon\n13260 Cassis, France",
          mapsLink:
            "https://www.google.com/maps/search/Hôtel+de+Ville+Place+Baragnon+Cassis",
          detail: "",
          photo: "/modular/samples/townhall.jpg",
        },
        {
          icon: "church",
          label: {
            en: "Church ceremony",
            ro: "Cununia religioasă",
            hu: "Templomi szertartás",
          },
          venue: "Chapelle Saint-Clair",
          address: "Chemin de Saint-Clair\n13260 Cassis, France",
          mapsLink:
            "https://www.google.com/maps/search/Chemin+de+Saint-Clair+Cassis",
          detail: "",
          photo: "/modular/samples/church.jpg",
        },
        {
          icon: "cheers",
          label: { en: "Reception", ro: "Recepția", hu: "Fogadás" },
          venue: "Domaine de la Falaise",
          address: "Route des Crêtes\n13260 Cassis, France",
          mapsLink:
            "https://www.google.com/maps/search/Route+des+Crêtes+Cassis",
          detail: "",
          photo: "/modular/samples/venue.jpg",
        },
      ],
    },
    schedule: { eyebrow: "", note: "" },
    transportation: { eyebrow: "", note: "" },
    accommodation: { eyebrow: "", note: "" },
    notes: { eyebrow: "", note: "" },
    contact: { eyebrow: "", note: "" },
    rsvp: { eyebrow: "", note: "" },
  },
};
