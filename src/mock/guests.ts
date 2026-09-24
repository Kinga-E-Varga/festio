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
  duplicate: false,
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
      { id: "n-radu", name: "Radu Stan", sent: true },
      { id: "n-irina", name: "Irina Stan", sent: true },
    ],
    replies: [
      reply("r-maria", "s1", "Maria Popescu", { note: "Abia așteptăm!" }),
      reply("r-andrei", "s1", "Andrei Popescu", { note: "Abia așteptăm!" }),
      reply("r-elena", "s2", "Elena Ionescu", {
        status: "not_going",
        note: "Sunt plecată, vă pup!",
      }),
      reply("r-mihai", "s3", "Mihai Dumitru"),
      reply("r-ioana", "s3", "Ioana Dumitru"),
      reply("r-luca", "s3", "Luca Dumitru"),
      reply("r-gheorghe", "s4", "Gheorghe Popp"),
      reply("r-elena-2", "s5", "Elena Ionescu", { duplicate: true }),
    ],
  },
};

export function findGuests(eventId: string): EventGuests {
  return GUESTS[eventId] ?? { list: [], replies: [] };
}
