import type { EventDoc, StoredQuestion } from "@/db/schemas/event";
import type { ListName } from "@/types/guests";
import type { InvitationDoc } from "@/db/schemas/invitation";
import type { SeatingDoc } from "@/db/schemas/seating";
import { DEFAULT_DATE_FORMAT } from "@/lib/invitation";
import { DEFAULT_QUESTIONS } from "@/lib/suggested";
import * as anaVlad from "./ana-vlad";
import {
  TIME_ZONE,
  dayFromNow,
  households,
  partyReply,
  type SeedReply,
} from "./build";

/*
 * The seeded events, from the old `src/mock/dashboard.ts`: every status and
 * package, Protected and Hidden, over 100% replies, one past and one deleted.
 * Counts, versions and the host are filled in by `index.ts`.
 */

export interface SeedEvent {
  id: string;
  event: Omit<
    EventDoc,
    | "hostId"
    | "counts"
    | "summary"
    | "version"
    | "dataVersion"
    | "invitationVersion"
    | "createdAt"
  >;
  invitation?: InvitationDoc;
  replies: SeedReply[];
  guestList: ListName[];
  /** Seats as person ID → table ID; `index.ts` copies the names in. */
  seating?: Omit<SeatingDoc, "seats"> & { seats: Record<string, string> };
}

interface Crowd {
  coming: number;
  notComing: number;
  /** Names on the list who haven't replied. */
  waiting?: number;
  /** Replies whose first person isn't on the list: the Unknown tag. */
  unknown?: number;
  /** Pre-load a guest list from the names. */
  preloaded: boolean;
  seed: number;
  /** The replies answer the other suggested questions too (`SUGGESTED_QUESTIONS`). */
  suggested?: boolean;
}

/** Made-up replies (and a matching guest list) for the big events. */
function crowd({
  coming,
  notComing,
  waiting = 0,
  unknown = 0,
  preloaded,
  seed,
  suggested = false,
}: Crowd): Pick<SeedEvent, "replies" | "guestList"> {
  const used = new Set<string>();
  const going = households(coming, seed, used);
  const declined = households(notComing, seed + 1, used);
  const replies = [...going, ...declined].map((party, index) =>
    partyReply(
      party,
      `r${index + 1}`,
      index < going.length,
      1 + (index % 30),
      seed + index,
      suggested,
    ),
  );
  if (!preloaded) return { replies, guestList: [] };

  const unknownIds = new Set(
    replies.slice(0, unknown).map((reply) => reply.people[0].id),
  );
  const repliedNames = replies.flatMap((reply) =>
    reply.people.filter((person) => !unknownIds.has(person.id)),
  );
  const waitingNames = households(waiting, seed + 2, used).flatMap(
    (party) => party.people,
  );
  const guestList = [...repliedNames, ...waitingNames].map((person, index) => ({
    id: `n${index + 1}`,
    name: person.name,
    sent: true,
  }));
  return { replies, guestList };
}

/** What every seeded event starts with. */
const shared = {
  questions: DEFAULT_QUESTIONS,
  dataDeleted: false,
  timeZone: TIME_ZONE,
};

/** The default questions of an event whose replies already answer them. */
const ANSWERED_QUESTIONS = DEFAULT_QUESTIONS.map((question) => ({
  ...question,
  answered: true,
}));

/** Age and diet, then every other suggested question, all answered by the replies. */
const SUGGESTED_QUESTIONS: StoredQuestion[] = [
  ...ANSWERED_QUESTIONS,
  ...(
    ["transport", "accommodation", "song", "phone", "accessibility"] as const
  ).map((id) => ({
    id,
    suggested: true as const,
    required: false,
    archived: false,
    answered: true,
  })),
];

export const SEED_EVENTS: SeedEvent[] = [
  {
    id: "maria-andrei",
    event: {
      ...shared,
      title: "Maria & Andrei — Cununie civilă și petrecere",
      kind: "wedding",
      language: "ro",
      date: dayFromNow(2),
      slug: "maria-andrei",
      visibility: "protected",
      password: "andrei26",
      expectedGuests: 110,
      preloaded: true,
      package: "custom",
      templateId: "wolf-dance",
      questions: SUGGESTED_QUESTIONS,
    },
    invitation: {
      kind: "simple",
      values: {
        rsvpMessage: "Ne-ar face mare plăcere să știm dacă poți veni.",
        title1: "Vă invităm să",
        title2: "sărbătoriți nunta noastră",
        name1: "Maria",
        name2: "Andrei",
        dateFormat: DEFAULT_DATE_FORMAT,
        text1: "Cununia | 16:00",
        text2: "Primăria Cluj-Napoca",
        text3: "Petrecerea | 19:00",
        text4: "Restaurant Cetate, Cluj-Napoca",
      },
      envelope: true,
      opening: "slide",
      version: 0,
    },
    ...crowd({
      coming: 82,
      notComing: 14,
      waiting: 28,
      unknown: 5,
      preloaded: true,
      seed: 1,
      suggested: true,
    }),
    seating: {
      tables: [
        { id: "t1", name: "Masa mirilor", seats: 8 },
        { id: "t2", name: "Masa 2", seats: 10 },
      ],
      seats: {
        "r1-p1": "t1",
        "r1-p2": "t1",
        "r2-p1": "t2",
      },
      version: 0,
    },
  },
  {
    id: "botez-sofia",
    event: {
      ...shared,
      title: "Botez Sofia — Grădina Bunicii",
      kind: "christening",
      language: "en",
      date: dayFromNow(35),
      repliesCloseAt: `${dayFromNow(28)}T18:00`,
      slug: "botez-sofia",
      visibility: "public",
      expectedGuests: 70,
      preloaded: true,
      package: "standard",
      questions: ANSWERED_QUESTIONS,
    },
    /* More replies than expected: past 100%. */
    ...crowd({ coming: 94, notComing: 11, preloaded: true, seed: 2 }),
  },
  {
    id: "logodna-ana-vlad",
    event: {
      ...shared,
      title: "Logodnă Ana & Vlad — Vila Florilor",
      kind: "engagement",
      language: "ro",
      date: dayFromNow(49),
      slug: "ana-vlad",
      visibility: "public",
      expectedGuests: 8,
      preloaded: true,
      package: "custom",
      questions: anaVlad.questions,
    },
    replies: anaVlad.replies,
    guestList: anaVlad.guestList,
  },
  {
    id: "aniversare-50",
    event: {
      ...shared,
      title: "Aniversare 50 — Ion Popescu",
      kind: "birthday",
      language: "en",
      date: dayFromNow(77),
      slug: "ion-50",
      visibility: "hidden",
      expectedGuests: 60,
      preloaded: false,
      package: "free",
    },
    replies: [],
    guestList: [],
  },
  {
    /* A Custom event on a modular template, still Hidden: not shared yet. */
    id: "revelion",
    event: {
      ...shared,
      title: "Revelion 2027 — Casa Mare",
      kind: "dinnerParty",
      language: "en",
      date: dayFromNow(70),
      slug: "revelion-2027",
      visibility: "hidden",
      expectedGuests: 80,
      preloaded: false,
      package: "custom",
      templateId: "olive-garden",
    },
    replies: [],
    guestList: [],
  },
  {
    /* Past the retention window: only the leftover event card is kept. */
    id: "cumetrie-luca",
    event: {
      ...shared,
      title: "Cumetrie Luca — Restaurant Salcia",
      kind: "christening",
      language: "en",
      date: dayFromNow(-84),
      slug: "cumetrie-luca",
      visibility: "public",
      expectedGuests: 80,
      preloaded: true,
      package: "standard",
      dataDeleted: true,
    },
    replies: [],
    guestList: [],
  },
  {
    id: "majorat-ana",
    event: {
      ...shared,
      title: "Majorat Ana — Terasa Verde",
      kind: "birthday",
      language: "en",
      date: dayFromNow(-14),
      slug: "majorat-ana",
      visibility: "protected",
      password: "ana18ana",
      expectedGuests: 45,
      preloaded: false,
      questions: ANSWERED_QUESTIONS,
      package: "free",
    },
    ...crowd({ coming: 30, notComing: 4, preloaded: false, seed: 3 }),
  },
];
