import type { ModularTemplate } from "@/types/modular";

/**
 * Sunbaked and Fraunces + Space Grotesk on a plain ground, with the Rounded
 * header. Helpful notes shows Dress code and Gifts.
 * One location, for the ceremony and the dinner.
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
    { section: "header", variant: "2" }, // rounded
    { section: "cover", variant: "2" }, // full-circle
    { section: "title", variant: "2" }, // plain
    { section: "date-time", variant: "2" }, // plain
    { section: "countdown", variant: "2" }, // cards
    { section: "location", variant: "2" }, // split
    { section: "schedule", variant: "2" }, // simple
    { section: "transportation", variant: "2" }, // simple
    { section: "accommodation", variant: "2" }, // simple
    { section: "menu", variant: "2" }, // printed-card
    { section: "notes", variant: "3" }, // list
    { section: "faq", variant: "2" }, // simple
    { section: "rsvp", variant: "2" }, // band
    { section: "footer", variant: "2" }, // band
  ],
  values: {
    header: { markStart: "Maddie & Claude", markMiddle: "", markEnd: "" },
    title: {
      namesStart: "Maddie & Claude are tying the knot",
      namesMiddle: "",
      namesEnd: "",
      eyebrow: {
        en: "We’re getting married",
        ro: "Ne căsătorim",
        hu: "Összeházasodunk",
      },
      caption: {
        en: "Come for the vows, stay for the dancing. A weekend of food, music and terrible dance moves on the cliffs above Cassis.",
        ro: "Veniți la jurăminte, rămâneți la dans. Un weekend cu mâncare, muzică și dans stângaci pe falezele de deasupra Cassis-ului.",
        hu: "Gyere a fogadalomra, maradj a táncra. Egy hétvége étellel, zenével és borzasztó tánclépésekkel a Cassis fölötti sziklákon.",
      },
    },
    "date-time": {
      note: {
        en: "Ceremony at 3:30 pm, apéritif at 5:00 pm, then dinner and dancing until late.",
        ro: "Ceremonia la 15:30, aperitiv la 17:00, apoi cină și dans până târziu.",
        hu: "Szertartás 15:30-kor, aperitif 17:00-kor, aztán vacsora és tánc késő estig.",
      },
    },
    countdown: {
      eyebrow: {
        en: "The big day is in",
        ro: "Până la marea zi mai sunt",
        hu: "A nagy napig hátravan",
      },
    },
    location: {
      venues: [
        {
          label: { en: "Celebration", ro: "Petrecere", hu: "Ünnepség" },
          venue: "Domaine de la Falaise",
          address: "Route des Crêtes\n13260 Cassis, France",
          detail: {
            en: "Ceremony & dinner, all in one place",
            ro: "Ceremonia și cina, în același loc",
            hu: "Szertartás és vacsora, egy helyen",
          },
          photo: "/modular/samples/location.jpg",
        },
      ],
    },
    schedule: {
      eyebrow: "",
      heading: {
        en: "How the day unfolds",
        ro: "Cum se desfășoară ziua",
        hu: "Így telik a nap",
      },
      headingItalic: "",
      // One day only: the Saturday.
      days: [
        {
          values: {
            label: {
              en: "Saturday · 18 Sep",
              ro: "Sâmbătă · 18 sept.",
              hu: "Szombat · szept. 18.",
            },
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
              icon: "heart",
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
              icon: "sparkle",
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
              icon: "moon",
            },
          ],
        },
      ],
    },
    transportation: {
      heading: {
        en: "Getting there made easy",
        ro: "Cum ajungi fără bătăi de cap",
        hu: "Odajutás egyszerűen",
      },
      note: {
        en: "By train, by shuttle or by car: however you come, we’ll help you find the way.",
        ro: "Cu trenul, cu transferul sau cu mașina: oricum ai veni, te ajutăm să găsești drumul.",
        hu: "Vonattal, transzferrel vagy autóval: bárhogy jössz, segítünk odatalálni.",
      },
    },
    menu: {
      eyebrow: { en: "Menu", ro: "Meniu", hu: "Menü" },
      heading: { en: "At the table", ro: "La masă", hu: "Az asztalnál" },
      note: {
        en: "Seasonal, local and made to share. Tell us about any allergies in your reply.",
        ro: "De sezon, local și făcut pentru a fi împărțit. Spune-ne în răspuns dacă ai alergii.",
        hu: "Szezonális, helyi és közös tálakból. Ha allergiás vagy, írd meg a válaszodban.",
      },
      courses: [
        {
          label: { en: "To start", ro: "Pentru început", hu: "Előétel" },
          title: {
            en: "Panisse, tapenade & anchoïade\nTomato tart, fresh basil",
            ro: "Panisse, tapenadă și anchoïade\nTartă cu roșii, busuioc proaspăt",
            hu: "Panisse, tapenade és anchoïade\nParadicsomos pite, friss bazsalikom",
          },
          note: "",
        },
        {
          label: { en: "Main", ro: "Fel principal", hu: "Főétel" },
          title: {
            en: "Sea bream, fennel, saffron sauce\nSlow lamb shoulder, herbes de Provence",
            ro: "Doradă, fenicul, sos de șofran\nSpată de miel gătită încet, ierburi de Provence",
            hu: "Tengeri keszeg, édeskömény, sáfrányos mártás\nLassan sült báránylapocka, provence-i fűszerek",
          },
          note: "",
        },
        {
          label: { en: "Dessert", ro: "Desert", hu: "Desszert" },
          title: {
            en: "Fig & almond tart\nLate-night lavender honey ice cream",
            ro: "Tartă cu smochine și migdale\nÎnghețată cu miere de lavandă, pentru târziu",
            hu: "Fügés-mandulás pite\nKéső esti levendulamézes fagylalt",
          },
          note: "",
        },
        {
          label: { en: "At the bar", ro: "La bar", hu: "A bárban" },
          title: {
            en: "Cassis rosé, pastis & cold beer\nCocktails until the last dance",
            ro: "Rosé de Cassis, pastis și bere rece\nCocktailuri până la ultimul dans",
            hu: "Cassis-i rosé, pastis és hideg sör\nKoktélok az utolsó táncig",
          },
          note: "",
        },
      ],
    },
    gifts: { showAccount: false },
    cover: {
      photo: "/modular/samples/couple-ava-mateo.jpg",
      kicker: { en: "You're invited", ro: "Te invităm", hu: "Meghívunk" },
    },
  },
};
