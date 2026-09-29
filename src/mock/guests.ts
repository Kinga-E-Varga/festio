import type { AnswerValue, EventGuests, GuestReply } from "@/types/guests";

/*
 * Mock guest lists by event id. Only the engagement carries rows; every
 * other event reads as empty. Type imports only, like `lib/guests.ts`.
 */

const reply = (
  id: string,
  submissionId: string,
  name: string,
  extra: Partial<GuestReply> = {},
): GuestReply => ({
  id,
  submissionId,
  name,
  status: "going",
  note: null,
  repliedAt: "2026-07-01T12:00",
  differentPerson: false,
  ...extra,
});

/* The reply-wide answers each party gave, copied onto every person in it. */
const party = (
  room: boolean | null,
  song: string | null,
): Record<string, AnswerValue | null> => ({
  "q-room": room,
  "q-song": song,
});

const s1 = party(false, "Perfect – Ed Sheeran");
const s3 = party(true, null);
const s6 = party(false, "Mamma Mia – ABBA");

const GUESTS: Record<string, EventGuests> = {
  "logodna-ana-vlad": {
    list: [
      { id: "n-maria", name: "Maria Popescu", sent: true },
      { id: "n-andrei", name: "Andrei Popescu", sent: true },
      { id: "n-elena", name: "Elena Ionescu", sent: true },
      { id: "n-mihai", name: "Mihai Dumitru", sent: true },
      { id: "n-ioana", name: "Ioana Dumitru", sent: true },
      { id: "n-gheorghe", name: "Gheorghe Pop", sent: false },
      {
        id: "n-radu",
        name: "Radu Constantin Alexandru Stan-Vlădescu Popovici",
        sent: true,
      },
      { id: "n-irina", name: "Irina Stan", sent: true },
      { id: "n-sorin", name: "Sorin Marin", sent: true },
    ],
    /* Custom questions, so the summary shows how a modular form's answers read. */
    questions: [
      {
        id: "q-main",
        label: "Fel principal",
        scope: "person",
        kind: "choice",
        options: [
          { id: "o-fish", label: "Pește" },
          { id: "o-beef", label: "Vită" },
          { id: "o-pasta", label: "Paste" },
        ],
      },
      {
        id: "q-room",
        label: "Aveți nevoie de cazare?",
        scope: "reply",
        kind: "yesNo",
      },
      {
        id: "q-song",
        label: "Ce melodie vreți să auziți?",
        scope: "reply",
        kind: "text",
      },
    ],
    replies: [
      reply("r-maria", "s1", "Maria Popescu", {
        note: "Abia așteptăm!",
        repliedAt: "2026-07-02T09:14",
        ageGroup: "adult",
        diet: ["vegetarian"],
        answers: { ...s1, "q-main": "o-fish" },
      }),
      reply("r-andrei", "s1", "Andrei Popescu", {
        note: "Abia așteptăm!",
        repliedAt: "2026-07-02T09:14",
        ageGroup: "adult",
        diet: ["other"],
        dietOther: "Fără ceapă",
        answers: { ...s1, "q-main": "o-beef" },
      }),
      reply("r-elena", "s2", "Elena Ionescu", {
        status: "not_going",
        note: "Sunt plecată, vă pup!",
        repliedAt: "2026-07-04T18:40",
      }),
      reply("r-mihai", "s3", "Mihai Dumitru", {
        repliedAt: "2026-07-06T20:05",
        ageGroup: "adult",
        diet: [],
        answers: { ...s3, "q-main": "o-beef" },
      }),
      reply("r-ioana", "s3", "Ioana Dumitru", {
        repliedAt: "2026-07-06T20:05",
        ageGroup: "adult",
        diet: ["glutenFree", "lactoseFree"],
        answers: { ...s3, "q-main": "o-fish" },
      }),
      reply("r-luca", "s3", "Luca Dumitru", {
        repliedAt: "2026-07-06T20:05",
        ageGroup: "child",
        diet: ["nutAllergy"],
        answers: { ...s3, "q-main": "o-pasta" },
      }),
      reply("r-sofia", "s3", "Sofia Dumitru", {
        repliedAt: "2026-07-06T20:05",
        ageGroup: "baby",
        diet: [],
        answers: { ...s3, "q-main": null },
      }),
      reply("r-gheorghe", "s4", "Gheorghe Popp", {
        repliedAt: "2026-07-09T11:30",
        ageGroup: "adult",
        diet: null,
        answers: { ...party(null, null), "q-main": null },
      }),
      reply("r-elena-2", "s5", "Elena Ionescu", {
        note: "Venim amândouă!",
        repliedAt: "2026-07-15T08:22",
        ageGroup: "adult",
        diet: ["vegan"],
        answers: { ...party(true, "Dancing Queen – ABBA"), "q-main": "o-fish" },
      }),
      /* A party with a shared name (Maria, as in s1) and a name not on the list. */
      reply("r-maria-2", "s6", "Maria Popescu", {
        note: "Ne vedem acolo!",
        repliedAt: "2026-07-18T19:47",
        ageGroup: "adult",
        diet: [],
        answers: { ...s6, "q-main": "o-pasta" },
      }),
      reply("r-cristina", "s6", "Cristina Popescu", {
        note: "Ne vedem acolo!",
        repliedAt: "2026-07-18T19:47",
        ageGroup: "child",
        diet: ["vegetarian"],
        answers: { ...s6, "q-main": "o-pasta" },
      }),
      reply(
        "r-radu",
        "s6",
        "Radu Constantin Alexandru Stan-Vlădescu Popovici",
        {
          note: "Ne vedem acolo!",
          repliedAt: "2026-07-18T19:47",
          ageGroup: "adult",
          diet: ["other"],
          dietOther: "Alergie la fructe de mare",
          answers: { ...s6, "q-main": "o-beef" },
        },
      ),
      /* A plain decline: on the list, one reply, nothing to sort out. */
      reply("r-sorin", "s7", "Sorin Marin", {
        status: "not_going",
        note: "Din păcate avem nuntă în aceeași zi.",
        repliedAt: "2026-07-20T10:12",
      }),
    ],
  },
};

export function findGuests(eventId: string): EventGuests {
  return GUESTS[eventId] ?? { list: [], replies: [], questions: [] };
}
