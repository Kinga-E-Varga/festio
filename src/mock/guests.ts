import type { EventGuests, GuestReply } from "@/types/guests";

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

const GUESTS: Record<string, EventGuests> = {
  "logodna-ana-vlad": {
    list: [
      { id: "n-maria", name: "Maria Popescu", sent: true },
      { id: "n-andrei", name: "Andrei Popescu", sent: true },
      { id: "n-elena", name: "Elena Ionescu", sent: true },
      { id: "n-mihai", name: "Mihai Dumitru", sent: true },
      { id: "n-ioana", name: "Ioana Dumitru", sent: true },
      { id: "n-gheorghe", name: "Gheorghe Pop", sent: false },
      { id: "n-radu", name: "Radu Constantin Alexandru Stan-Vlădescu Popovici", sent: true },
      { id: "n-irina", name: "Irina Stan", sent: true },
      { id: "n-sorin", name: "Sorin Marin", sent: true },
    ],
    replies: [
      reply("r-maria", "s1", "Maria Popescu", {
        note: "Abia așteptăm!",
        repliedAt: "2026-07-02T09:14",
        ageGroup: "adult",
        diet: ["vegetarian"],
      }),
      reply("r-andrei", "s1", "Andrei Popescu", {
        note: "Abia așteptăm!",
        repliedAt: "2026-07-02T09:14",
        ageGroup: "adult",
        diet: [],
      }),
      reply("r-elena", "s2", "Elena Ionescu", {
        status: "not_going",
        note: "Sunt plecată, vă pup!",
        repliedAt: "2026-07-04T18:40",
      }),
      reply("r-mihai", "s3", "Mihai Dumitru", { repliedAt: "2026-07-06T20:05", ageGroup: "adult", diet: [] }),
      reply("r-ioana", "s3", "Ioana Dumitru", {
        repliedAt: "2026-07-06T20:05",
        ageGroup: "adult",
        diet: ["glutenFree", "lactoseFree"],
      }),
      reply("r-luca", "s3", "Luca Dumitru", {
        repliedAt: "2026-07-06T20:05",
        ageGroup: "child",
        diet: ["nutAllergy"],
      }),
      reply("r-sofia", "s3", "Sofia Dumitru", { repliedAt: "2026-07-06T20:05", ageGroup: "baby", diet: [] }),
      reply("r-gheorghe", "s4", "Gheorghe Popp", {
        repliedAt: "2026-07-09T11:30",
        ageGroup: null,
        diet: null,
      }),
      reply("r-elena-2", "s5", "Elena Ionescu", {
        note: "Venim amândouă!",
        repliedAt: "2026-07-15T08:22",
        ageGroup: "adult",
        diet: ["vegan"],
      }),
      /* A party with a shared name (Maria, as in s1) and a name not on the list. */
      reply("r-maria-2", "s6", "Maria Popescu", {
        note: "Ne vedem acolo!",
        repliedAt: "2026-07-18T19:47",
        ageGroup: "adult",
        diet: [],
      }),
      reply("r-cristina", "s6", "Cristina Popescu", {
        note: "Ne vedem acolo!",
        repliedAt: "2026-07-18T19:47",
        ageGroup: "child",
        diet: ["vegetarian"],
      }),
      reply("r-radu", "s6", "Radu Constantin Alexandru Stan-Vlădescu Popovici", {
        note: "Ne vedem acolo!",
        repliedAt: "2026-07-18T19:47",
        ageGroup: "adult",
        diet: null,
      }),
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
  return GUESTS[eventId] ?? { list: [], replies: [] };
}
