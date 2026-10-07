import type { InvitationBasics, SectionSamples } from "@/types/modular";

/*
 * Every modular invitation's sample content, in one place: the date, then
 * every field of every section by section id and field id. A template
 * overrides only what it changes (`ModularTemplate.values`); a section shows
 * only the fields it has. A phrase is given in every language; a name, a time
 * or an address stays a plain string. Photos are paths until uploads exist.
 */

/** No event yet: every modular template previews this date. */
export const DEFAULT_BASICS: InvitationBasics = { date: "2027-09-18" };

/** Each section's sample values, by section id, then field id. */
export const DEFAULTS: Record<string, SectionSamples> = {
  header: {
    markStart: "M",
    markMiddle: "&",
    markEnd: "C",
  },
  cover: {
    photo: "/modular/samples/tuscany.png",
    kicker: {
      en: "A weekend in Cassis",
      ro: "Un weekend la Cassis",
      hu: "Egy hétvége Cassis-ban",
    },
  },
  title: {
    decoration: "diamonds",
    namesStart: "Maddie",
    namesMiddle: "&",
    namesEnd: "Claude",
    secondLine: "",
    eyebrow: {
      en: "Together with our families",
      ro: "Împreună cu familiile noastre",
      hu: "Családjainkkal együtt",
    },
    caption: {
      en: "invite you to celebrate the beginning of our forever",
      ro: "vă invită să fiți alături de ei la început de drum",
      hu: "meghívnak, hogy velük ünnepeld közös életük kezdetét",
    },
  },
  "date-time": {
    dateFormat: "shortWeekday",
    eyebrow: {
      en: "Mark your calendar",
      ro: "Notează în calendar",
      hu: "Jelöld be a naptárban",
    },
    heading: {
      en: "A day to remember.",
      ro: "O zi de neuitat.",
      hu: "Egy nap, amit nem felejtünk.",
    },
    headingItalic: {
      en: "A weekend to savour.",
      ro: "Un weekend de savurat.",
      hu: "Egy hétvége, amit kiélvezünk.",
    },
    note: {
      en: "Ceremony at 4:00 pm, cocktails at 5:00 pm, then dinner and dancing until late.",
      ro: "Ceremonia la 16:00, cocktailuri la 17:00, apoi cină și dans până târziu.",
      hu: "Szertartás 16:00-kor, koktélok 17:00-kor, aztán vacsora és tánc késő estig.",
    },
  },
  countdown: {
    eyebrow: {
      en: "Counting the days",
      ro: "Numărăm zilele",
      hu: "Számoljuk a napokat",
    },
  },
  location: {
    eyebrow: {
      en: "A place we love",
      ro: "Un loc pe care îl iubim",
      hu: "Egy hely, amit szeretünk",
    },
    heading: {
      en: "Meet us by the sea",
      ro: "Ne vedem la mare",
      hu: "Találkozzunk a tengernél",
    },
    headingItalic: "",
    note: {
      en: "White cliffs, a little harbour town, and room for one more at our table.",
      ro: "Faleze albe, un mic oraș-port și loc pentru încă unul la masa noastră.",
      hu: "Fehér sziklák, egy kis kikötőváros, és még egy hely az asztalunknál.",
    },
    venues: [
      {
        label: {
          en: "Ceremony",
          ro: "Ceremonia",
          hu: "Szertartás",
        },
        venue: "Chapelle Saint-Clair",
        address: "Chemin de Saint-Clair\n13260 Cassis, France",
        detail: {
          en: "A short ceremony, then a shuttle up the coast road",
          ro: "O ceremonie scurtă, apoi un transfer pe drumul de coastă",
          hu: "Rövid szertartás, aztán transzfer a part menti úton",
        },
        photo: "/modular/samples/tuscany-church.png",
      },
      {
        label: {
          en: "Reception",
          ro: "Recepția",
          hu: "Fogadás",
        },
        venue: "Domaine de la Falaise",
        address: "Route des Crêtes\n13260 Cassis, France",
        detail: {
          en: "Apéritif, dinner and dancing above the sea",
          ro: "Aperitiv, cină și dans deasupra mării",
          hu: "Aperitif, vacsora és tánc a tenger fölött",
        },
        photo: "/modular/samples/tuscany-venue.png",
      },
    ],
  },
  schedule: {
    eyebrow: {
      en: "The whole lovely weekend",
      ro: "Tot weekendul",
      hu: "Az egész hétvége",
    },
    heading: {
      en: "Come for the vows.",
      ro: "Veniți pentru jurăminte.",
      hu: "Gyertek az eskü miatt,",
    },
    headingItalic: {
      en: "Stay for the sunset.",
      ro: "Rămâneți pentru apus.",
      hu: "maradjatok a naplementére.",
    },
    note: {
      en: "We’ve made a little room in the schedule for the things that matter: good food, old friends, and a slow Sunday morning by the sea.",
      ro: "Am lăsat loc în program pentru ce contează: mâncare bună, prieteni vechi și o dimineață de duminică fără grabă, la mare.",
      hu: "Hagytunk helyet a programban a fontos dolgoknak: jó ételeknek, régi barátoknak és egy ráérős vasárnap reggelnek a tengerparton.",
    },
    days: [
      {
        values: {
          date: "2027-09-17",
        },
        items: [
          {
            time: "19:00",
            title: {
              en: "Apéro on the port",
              ro: "Aperitiv în port",
              hu: "Aperitif a kikötőben",
            },
            note: {
              en: "Rosé, a few bites & a first toast by the boats",
              ro: "Rosé, câteva gustări și primul toast lângă bărci",
              hu: "Rosé, pár falat és az első koccintás a hajók mellett",
            },
            icon: "meal",
          },
        ],
      },
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
              en: "In the little chapel, with you beside us",
              ro: "În capela cea mică, cu voi alături",
              hu: "A kis kápolnában, veletek az oldalunkon",
            },
            icon: "heart",
          },
          {
            time: "17:00",
            title: {
              en: "Apéritif above the sea",
              ro: "Aperitiv deasupra mării",
              hu: "Aperitif a tenger fölött",
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
              en: "Dinner under the pines",
              ro: "Cina sub pini",
              hu: "Vacsora a fenyők alatt",
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
      {
        values: {
          date: "2027-09-19",
        },
        items: [
          {
            time: "11:00",
            title: {
              en: "One last slow morning",
              ro: "O ultimă dimineață fără grabă",
              hu: "Egy utolsó ráérős reggel",
            },
            note: {
              en: "Brunch on the terrace & a proper goodbye",
              ro: "Brunch pe terasă și un rămas-bun cum se cuvine",
              hu: "Villásreggeli a teraszon és egy rendes búcsú",
            },
            icon: "meal",
          },
        ],
      },
    ],
  },
  transportation: {
    eyebrow: {
      en: "Getting here, together",
      ro: "Cum ajungem, împreună",
      hu: "Együtt odajutni",
    },
    heading: {
      en: "The journey is part of it",
      ro: "Drumul face parte din poveste",
      hu: "Az út is a része",
    },
    headingItalic: "",
    note: {
      en: "By train, by shuttle or by car: however you come, we’ll help you find the way.",
      ro: "Cu trenul, cu transferul sau cu mașina: oricum ai veni, te ajutăm să găsești drumul.",
      hu: "Vonattal, transzferrel vagy autóval: bárhogy jössz, segítünk odatalálni.",
    },
    ways: [
      {
        label: {
          en: "By train",
          ro: "Cu trenul",
          hu: "Vonattal",
        },
        title: {
          en: "Come via Marseille",
          ro: "Prin Marsilia",
          hu: "Marseille-en keresztül",
        },
        text: {
          en: "Take the TGV to Marseille Saint-Charles, then the regional train to Cassis, about 25 minutes. Flying? Marseille Provence airport is 45 minutes by car.",
          ro: "Luați TGV-ul până la Marseille Saint-Charles, apoi trenul regional până la Cassis, circa 25 de minute. Veniți cu avionul? Aeroportul Marseille Provence e la 45 de minute cu mașina.",
          hu: "TGV-vel Marseille Saint-Charles-ig, onnan regionális vonattal Cassis-ig, kb. 25 perc. Repülsz? A Marseille Provence repülőtér 45 perc autóval.",
        },
      },
      {
        label: {
          en: "A little lift",
          ro: "Te ducem noi",
          hu: "Elviszünk",
        },
        title: {
          en: "We’ll arrange a shuttle",
          ro: "Organizăm un transfer",
          hu: "Transzfert szervezünk",
        },
        text: {
          en: "Shared rides will run between Cassis station, the port and the domaine. Add your arrival details to your reply.",
          ro: "Vor fi curse comune între gara din Cassis, port și domeniu. Scrie-ne în răspuns când ajungi.",
          hu: "Közös járatok lesznek a cassis-i állomás, a kikötő és a birtok között. A válaszban írd meg, mikor érkezel.",
        },
      },
      {
        label: {
          en: "By car",
          ro: "Cu mașina",
          hu: "Autóval",
        },
        title: {
          en: "Room to park",
          ro: "Loc de parcare",
          hu: "Van hely parkolni",
        },
        text: {
          en: "There’s free parking at the domaine. The Route des Crêtes is narrow and winding, so take it slowly after dark.",
          ro: "Parcarea la domeniu e gratuită. Route des Crêtes e îngust și cu multe curbe, așa că mergeți încet după lăsarea întunericului.",
          hu: "A birtokon ingyenes a parkolás. A Route des Crêtes keskeny és kanyargós, sötétedés után óvatosan vezess.",
        },
      },
    ],
  },
  accommodation: {
    eyebrow: {
      en: "Make a weekend of it",
      ro: "Fă din asta un weekend",
      hu: "Legyen belőle egy hétvége",
    },
    heading: {
      en: "A soft place to land,",
      ro: "Un loc liniștit de cazare,",
      hu: "Egy puha hely a pihenéshez,",
    },
    headingItalic: {
      en: "with the sea close by.",
      ro: "cu marea la un pas.",
      hu: "közel a tengerhez.",
    },
    note: {
      en: "We’ve gathered a few stays nearby, from a room at the domaine to a hotel by the port.",
      ro: "Am adunat câteva cazări în apropiere, de la o cameră la domeniu la un hotel lângă port.",
      hu: "Összegyűjtöttünk néhány közeli szállást, a birtok szobáitól egy kikötői hotelig.",
    },
    places: [
      {
        name: "Domaine de la Falaise",
        note: {
          en: "On the estate · limited rooms",
          ro: "Pe domeniu · camere puține",
          hu: "A birtokon · kevés szoba",
        },
        distance: {
          en: "The easiest stay",
          ro: "Cea mai simplă variantă",
          hu: "A legkényelmesebb",
        },
        link: "https://www.google.com/maps/search/Route+des+Crêtes+Cassis",
      },
      {
        name: "Cassis",
        note: {
          en: "By the port · 10 min drive",
          ro: "Lângă port · 10 min cu mașina",
          hu: "A kikötőnél · 10 perc autóval",
        },
        distance: {
          en: "A morning swim before brunch",
          ro: "O baie în mare înainte de brunch",
          hu: "Reggeli úszás a villásreggeli előtt",
        },
        link: "https://www.google.com/maps/search/hotels+Cassis+France",
      },
      {
        name: "La Ciotat",
        note: {
          en: "Seaside town · 15 min drive",
          ro: "Oraș la mare · 15 min cu mașina",
          hu: "Tengerparti város · 15 perc autóval",
        },
        distance: {
          en: "More choice, a long sandy beach",
          ro: "Mai multe opțiuni, o plajă lungă cu nisip",
          hu: "Több választék, hosszú homokos part",
        },
        link: "https://www.google.com/maps/search/hotels+La+Ciotat+France",
      },
    ],
  },
  menu: {
    eyebrow: {
      en: "At the table",
      ro: "La masă",
      hu: "Az asztalnál",
    },
    heading: {
      en: "A menu for lingering",
      ro: "Un meniu fără grabă",
      hu: "Egy menü, amivel nem sietünk",
    },
    headingItalic: "",
    note: {
      en: "A Provençal dinner, made with the season and meant to be shared.",
      ro: "O cină provensală, gătită cu ce aduce sezonul și făcută pentru a fi împărțită.",
      hu: "Provence-i vacsora az évszak ízeiből, közös tálakból.",
    },
    courses: [
      {
        label: {
          en: "To begin",
          ro: "La început",
          hu: "Kezdésnek",
        },
        title: {
          en: "Panisse & tapenade",
          ro: "Panisse și tapenadă",
          hu: "Panisse és tapenade",
        },
        note: {
          en: "Little bites to share with the first glass",
          ro: "Gustări mici, la primul pahar",
          hu: "Apró falatok az első pohárhoz",
        },
      },
      {
        label: {
          en: "From the sea",
          ro: "Din mare",
          hu: "A tengerből",
        },
        title: {
          en: "Catch of the day",
          ro: "Peștele zilei",
          hu: "A nap fogása",
        },
        note: {
          en: "From the Cassis boats, with fennel and saffron",
          ro: "De la bărcile din Cassis, cu fenicul și șofran",
          hu: "A cassis-i halászoktól, édesköménnyel és sáfránnyal",
        },
      },
      {
        label: {
          en: "From the hills",
          ro: "De pe dealuri",
          hu: "A dombokról",
        },
        title: {
          en: "Lamb with herbes de Provence",
          ro: "Miel cu ierburi de Provence",
          hu: "Bárány provence-i fűszerekkel",
        },
        note: {
          en: "Slow-cooked and served family-style",
          ro: "Gătit încet și servit ca în familie",
          hu: "Lassan főzve, családiasan tálalva",
        },
      },
      {
        label: {
          en: "To finish",
          ro: "La final",
          hu: "Végül",
        },
        title: {
          en: "Fig & almond tart",
          ro: "Tartă cu smochine și migdale",
          hu: "Fügés-mandulás pite",
        },
        note: {
          en: "One more reason to linger a little longer",
          ro: "Încă un motiv să mai rămâi puțin",
          hu: "Még egy ok, hogy maradj egy kicsit",
        },
      },
    ],
  },
  notes: {
    eyebrow: {
      en: "The little things",
      ro: "Lucrurile mărunte",
      hu: "Az apróságok",
    },
    heading: {
      en: "A few helpful notes",
      ro: "Câteva informații utile",
      hu: "Néhány hasznos tudnivaló",
    },
    headingItalic: "",
    note: {
      en: "The details that make a lovely weekend feel effortless.",
      ro: "Detaliile care fac un weekend frumos să pară ușor.",
      hu: "A részletek, amelyektől egy szép hétvége könnyednek érződik.",
    },
    showDressCode: true,
    showGifts: true,
    showCustom: true,
    items: [
      {
        kind: "dress-code",
        label: "",
        title: "",
        text: "",
        icon: "",
      },
      {
        kind: "gifts",
        label: "",
        title: "",
        text: "",
        icon: "",
      },
      {
        kind: "custom",
        label: {
          en: "Little ones",
          ro: "Cei mici",
          hu: "A legkisebbek",
        },
        title: {
          en: "Children are welcome",
          ro: "Copiii sunt bineveniți",
          hu: "A gyerekeket szeretettel várjuk",
        },
        text: {
          en: "There’s a quiet room with games and books, and a sitter from nine in the evening, so the grown-ups can dance.",
          ro: "Avem o cameră liniștită cu jocuri și cărți și o bonă de la ora nouă seara, ca cei mari să poată dansa.",
          hu: "Lesz egy csendes szoba játékokkal és könyvekkel, este kilenctől pedig bébiszitter, hogy a felnőttek táncolhassanak.",
        },
        icon: "heart",
      },
    ],
  },
  "dress-code": {
    eyebrow: {
      en: "What to wear",
      ro: "Ce să porți",
      hu: "Mit vegyél fel",
    },
    heading: {
      en: "Come as you feel",
      ro: "Vino cum te simți bine",
      hu: "Gyere úgy, ahogy jól érzed magad",
    },
    headingItalic: "",
    note: "",
    title: {
      en: "Summer by the sea, with a little Provençal ease",
      ro: "Vară la mare, cu o lejeritate provensală",
      hu: "Nyár a tengernél, egy kis provence-i lazasággal",
    },
    body: {
      en: "Think linen suits, flowing dresses, and shoes that are happy on old stone terraces. The wind picks up after dark, so bring a light layer.",
      ro: "Gândește-te la costume din in, rochii vaporoase și pantofi care se înțeleg cu terasele de piatră. După lăsarea serii bate vântul, așa că ia ceva subțire pe umeri.",
      hu: "Lenvászon öltöny, könnyű ruha és cipő, ami bírja a régi kőteraszokat. Sötétedés után feltámad a szél, hozz egy könnyű réteget.",
    },
    showSwatches: true,
    swatchLabel: {
      en: "A few colors we love",
      ro: "Câteva culori care ne plac",
      hu: "Néhány szín, amit szeretünk",
    },
    swatches: [
      { name: "", color: "accent" },
      { name: "", color: "secondary" },
      { name: "", color: "tertiary" },
      { name: "", color: "surface" },
      { name: "", color: "ink" },
    ],
  },
  gifts: {
    eyebrow: {
      en: "With gratitude",
      ro: "Cu recunoștință",
      hu: "Hálával",
    },
    heading: {
      en: "A note on gifts",
      ro: "Despre cadouri",
      hu: "Az ajándékokról",
    },
    headingItalic: "",
    note: "",
    title: {
      en: "Your presence is our present",
      ro: "Prezența ta e cel mai frumos dar",
      hu: "A jelenléted a legszebb ajándék",
    },
    body: {
      en: "Truly. If you’d like to give something, you’ll find our registry here, or you can add to our honeymoon fund. Either would mean the world.",
      ro: "Chiar așa. Dacă vrei totuși să ne dăruiești ceva, găsești aici lista noastră de cadouri sau poți contribui la fondul pentru luna de miere. Orice variantă ne-ar bucura enorm.",
      hu: "Tényleg. Ha mégis adnál valamit, itt találod az ajándéklistánkat, vagy hozzájárulhatsz a nászutunkhoz. Bármelyik nagyon sokat jelentene.",
    },
    showAccount: true,
    holder: "Madeline Éparvier",
    iban: "FR76 3000 6000 0112 3456 7890 189",
    reference: "Maddie & Claude",
    showRegistry: true,
    registryLink: "https://www.example.com/registry",
  },
  faq: {
    eyebrow: {
      en: "Wondering about something?",
      ro: "Te întrebi ceva?",
      hu: "Kérdésed van?",
    },
    heading: {
      en: "Good questions,",
      ro: "Întrebări bune,",
      hu: "Jó kérdések,",
    },
    headingItalic: {
      en: "good to know.",
      ro: "de știut.",
      hu: "jó tudni.",
    },
    note: {
      en: "Still curious? Send us a note and we’ll help you plan.",
      ro: "Mai ai întrebări? Scrie-ne și te ajutăm să-ți faci planul.",
      hu: "Még kíváncsi vagy? Írj nekünk, és segítünk megtervezni.",
    },
    linkLabel: {
      en: "Send us a note with your reply",
      ro: "Scrie-ne odată cu răspunsul",
      hu: "Írj nekünk a válaszoddal",
    },
    items: [
      {
        question: {
          en: "Can I bring a plus-one or my children?",
          ro: "Pot veni cu un însoțitor sau cu copiii?",
          hu: "Hozhatok kísérőt vagy a gyerekeimet?",
        },
        answer: {
          en: "We’ve kept a seat for everyone named on your invitation. Little ones are welcome — add them by name in your reply so we can make them comfortable.",
          ro: "Am păstrat câte un loc pentru fiecare persoană numită în invitație. Cei mici sunt bineveniți — adaugă-i pe nume în răspuns, ca să ne pregătim pentru ei.",
          hu: "Mindenkinek tartunk helyet, akinek a neve szerepel a meghívón. A kicsiket is szívesen látjuk — a válaszban add meg a nevüket, hogy felkészülhessünk rájuk.",
        },
      },
      {
        question: {
          en: "What should I wear for the ceremony?",
          ro: "Ce să port la ceremonie?",
          hu: "Mit vegyek fel a szertartásra?",
        },
        answer: {
          en: "The terraces are old stone, so block heels or flats are your friends. We’d love you to dress up, but feel at ease.",
          ro: "Terasele sunt din piatră veche, așa că tocurile groase sau pantofii fără toc sunt cea mai bună alegere. Ne-ar plăcea să te îmbraci elegant, dar să te simți comod.",
          hu: "A teraszok régi kőből vannak, ezért a vastag sarok vagy a lapos cipő a barátod. Örülünk, ha kiöltözöl, de érezd jól magad.",
        },
      },
      {
        question: {
          en: "Will the celebration be outdoors?",
          ro: "Petrecerea va fi în aer liber?",
          hu: "A szabadban lesz az ünnepség?",
        },
        answer: {
          en: "The apéritif and dinner are outdoors, on the terrace above the sea. If the mistral has other ideas, we move into the old stone barn.",
          ro: "Aperitivul și cina sunt afară, pe terasa de deasupra mării. Dacă mistralul are alte planuri, ne mutăm în vechiul hambar de piatră.",
          hu: "Az aperitif és a vacsora a szabadban lesz, a tenger fölötti teraszon. Ha a misztrál közbeszól, átköltözünk a régi kőcsűrbe.",
        },
      },
      {
        question: {
          en: "Can you accommodate dietary needs?",
          ro: "Puteți ține cont de nevoile alimentare?",
          hu: "Figyelembe tudjátok venni az étkezési igényeket?",
        },
        answer: {
          en: "Absolutely. Share any allergies or dietary needs in the reply form and our chef will take care of you.",
          ro: "Desigur. Spune-ne în formular dacă ai alergii sau nevoi alimentare, iar bucătarul va avea grijă de tine.",
          hu: "Természetesen. Az űrlapon jelezd az allergiádat vagy az étkezési igényeidet, és a séf gondoskodik rólad.",
        },
      },
      {
        question: {
          en: "When should I arrive?",
          ro: "Când ar trebui să ajung?",
          hu: "Mikor érkezzek?",
        },
        answer: {
          en: "Please arrive by 15:00 on Saturday so you have time to settle in before the ceremony begins at 15:30.",
          ro: "Te rugăm să ajungi până la 15:00 sâmbătă, ca să ai timp să te așezi înainte de ceremonia de la 15:30.",
          hu: "Kérünk, szombaton 15:00-ig érkezz, hogy legyen időd elhelyezkedni a 15:30-kor kezdődő szertartás előtt.",
        },
      },
    ],
  },
  playlist: {
    eyebrow: "",
    heading: {
      en: "Which song gets you off your chair?",
      ro: "Ce melodie te ridică de pe scaun?",
      hu: "Melyik dal ugraszt fel a székből?",
    },
    headingItalic: "",
    note: {
      en: "Add your song to your reply and we’ll hand the list to the band.",
      ro: "Scrie melodia ta în răspuns și dăm lista formației.",
      hu: "Írd meg a dalodat a válaszodban, és továbbadjuk a listát a zenekarnak.",
    },
  },
  rsvp: {
    eyebrow: {
      en: "A little note back",
      ro: "Un mic răspuns",
      hu: "Egy kis visszajelzés",
    },
    heading: {
      en: "Will you be there?",
      ro: "Veți fi acolo?",
      hu: "Ott leszel?",
    },
    headingItalic: {
      en: "We hope so.",
      ro: "Sperăm că da.",
      hu: "Reméljük, igen.",
    },
    note: {
      en: "Save your seat at our table. Kindly reply by 1 August 2027.",
      ro: "Păstrează-ți locul la masa noastră. Te rugăm să răspunzi până pe 1 august 2027.",
      hu: "Foglald le a helyed az asztalunknál. Kérjük, 2027. augusztus 1-ig válaszolj.",
    },
    thankYou: {
      en: "Thank you",
      ro: "Mulțumim",
      hu: "Köszönjük",
    },
    thanks: {
      en: "Your reply is with us.",
      ro: "Am primit răspunsul tău.",
      hu: "Megkaptuk a válaszod.",
    },
  },
};
