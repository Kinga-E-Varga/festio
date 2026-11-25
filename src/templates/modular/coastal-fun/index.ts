import type { ModularTemplate } from "@/types/modular";

/**
 * Sunbaked and Fraunces + Space Grotesk on a plain ground, round corners,
 * with the Colourful header and its M & C monogram. Opens on a full photo
 * (Full centred) and a short invitation in the text box. Icon styles
 * throughout; Helpful notes shows Dress code and Gifts. One location, for
 * the ceremony and the dinner.
 */
export const template: ModularTemplate = {
  kind: "modular",
  id: "coastal-fun",
  name: "Coastal Fun",
  package: "custom",
  eventTypes: ["wedding"],
  palette: "sunbaked",
  fontPair: "fraunces-space-grotesk",
  corners: "round",
  sections: [
    { section: "header", variant: "6" }, // colourful
    { section: "cover", variant: "11" }, // full centred
    { section: "textbox", variant: "1" }, // simple
    { section: "date-time", variant: "2" }, // simple accent
    { section: "countdown", variant: "4" }, // sentence joined
    { section: "location", variant: "5" }, // icon
    { section: "schedule", variant: "2" }, // icon & list
    { section: "transportation", variant: "2" }, // icon & cards
    { section: "accommodation", variant: "2" }, // icon & list
    { section: "notes", variant: "6" }, // icon & cards
    { section: "contact", variant: "4" }, // icon & list
    { section: "playlist", variant: "1" }, // accent
    { section: "rsvp", variant: "2" }, // bold band
    { section: "footer", variant: "2" }, // accent
  ],
  values: {
    cover: {
      photo: "/modular/samples/coastal-fun-cover.jpg",
      secondLine: {
        en: "are tying the knot",
        ro: "își unesc destinele",
        hu: "összeházasodnak",
      },
    },
    location: {
      venues: [
        {
          icon: "pin",
          venue: "Domaine de la Falaise",
          address: "Route des Crêtes\n13260 Cassis, France",
          mapsLink:
            "https://www.google.com/maps/search/Route+des+Crêtes+Cassis",
          detail: {
            en: "Ceremony & dinner, all in one place",
            ro: "Ceremonia și cina, în același loc",
            hu: "Szertartás és vacsora, egy helyen",
          },
          photo: "/modular/samples/venue.jpg",
        },
      ],
    },
    schedule: {
      heading: {
        en: "How the day unfolds",
        ro: "Cum se desfășoară ziua",
        hu: "Így telik a nap",
      },
      // One day only: the Saturday.
      days: [
        {
          values: {
            date: "2027-09-18",
          },
          items: [
            {
              time: "15:30",
              title: {
                en: "The ceremony",
                ro: "Ceremonia",
                hu: "A szertartás",
              },
              note: {
                en: "On the terrace above the sea, with you beside us",
                ro: "Pe terasa de deasupra mării, cu voi alături",
                hu: "A tenger fölötti teraszon, veletek az oldalunkon",
              },
            },
            {
              time: "17:00",
              title: {
                en: "Apéritif hour",
                ro: "Ora aperitivului",
                hu: "Aperitif",
              },
              note: {
                en: "Chilled rosé, little bites & the golden hour",
                ro: "Rosé rece, gustări și lumina de apus",
                hu: "Hideg rosé, falatkák és az aranyóra",
              },
            },
            {
              time: "19:30",
              title: {
                en: "Long-table dinner",
                ro: "Cina la masa lungă",
                hu: "Vacsora a hosszú asztalnál",
              },
              note: {
                en: "Toasts, Provençal food & dancing under the stars",
                ro: "Toasturi, mâncare provensală și dans sub stele",
                hu: "Pohárköszöntők, provence-i ételek és tánc a csillagok alatt",
              },
            },
          ],
        },
      ],
    },
    // The bride, the groom and a friend to call on the day.
    contact: {
      people: [
        {
          role: { en: "The bride", ro: "Mireasa", hu: "A menyasszony" },
          name: "Maddie",
          phone: "+40 722 123 456",
          email: "maddie@example.com",
        },
        {
          role: { en: "The groom", ro: "Mirele", hu: "A vőlegény" },
          name: "Claude",
          phone: "+40 733 654 321",
          email: "claude@example.com",
        },
        {
          role: {
            en: "On the day",
            ro: "În ziua evenimentului",
            hu: "A nagy napon",
          },
          name: "Ioana",
          phone: "+40 744 555 010",
        },
      ],
    },
  },
};
