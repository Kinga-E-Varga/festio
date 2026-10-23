import { Timestamp } from "firebase-admin/firestore";
import type { Person } from "@/db/schemas/reply";
import { DAY_MS, todayIn } from "@/lib/event";
import type { StoredReply } from "@/lib/guests";
import type { ListName } from "@/types/guests";

/*
 * Helpers for the seed. Dates are counted from the day it runs, so the
 * seeded events never all slide into the past.
 */

export const TIME_ZONE = "Europe/Bucharest";

/** A reply card with the ID it is saved under. */
export type SeedReply = StoredReply;

/** A pre-loaded name; every card starts at version 0. */
export type SeedName = Omit<ListName, "version">;

/** A calendar day `days` from today, `YYYY-MM-DD`, in the seed's time zone. */
export function dayFromNow(days: number): string {
  return todayIn(TIME_ZONE, new Date(Date.now() + days * DAY_MS));
}

/** A moment `days` from now; negative is in the past. */
export function momentFromNow(days: number): Timestamp {
  return Timestamp.fromMillis(Date.now() + days * DAY_MS);
}

/** The same numbers on every run, so everyone gets the same seed. */
function random(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  "Ana",
  "Andrei",
  "Bianca",
  "Cristian",
  "Daria",
  "Dan",
  "Elena",
  "Florin",
  "Gabriela",
  "George",
  "Ioana",
  "Ion",
  "Laura",
  "Mihai",
  "Maria",
  "Radu",
  "Raluca",
  "Sorin",
  "Teodora",
  "Vlad",
  "Alexandra",
  "Bogdan",
  "Carmen",
  "Emil",
  "Irina",
  "Lucian",
  "Monica",
  "Paul",
  "Simona",
  "Tudor",
];

const LAST_NAMES = [
  "Popescu",
  "Ionescu",
  "Pop",
  "Dumitru",
  "Stan",
  "Stoica",
  "Gheorghe",
  "Matei",
  "Ciobanu",
  "Rusu",
  "Munteanu",
  "Florea",
  "Moldovan",
  "Lazăr",
  "Barbu",
  "Constantin",
  "Tudor",
  "Marin",
  "Cozma",
  "Neagu",
];

/** Diets to pick from: mostly none, sometimes one need. */
const DIETS: Person["diet"][] = [
  [],
  [],
  [],
  [],
  [],
  ["vegetarian"],
  ["vegan"],
  ["glutenFree"],
  ["lactoseFree"],
];

interface Party {
  people: { name: string; age: "adult" | "child" | "baby" }[];
}

/**
 * Households of one to four, each a family name with distinct first names:
 * `count` people in all, no name twice. Pass the same `used` to keep names
 * unique across several calls.
 */
export function households(
  count: number,
  seed: number,
  used = new Set<string>(),
): Party[] {
  const next = random(seed);
  const parties: Party[] = [];
  let left = count;
  while (left > 0) {
    const size = Math.min(left, 1 + Math.floor(next() * 4));
    const last = LAST_NAMES[Math.floor(next() * LAST_NAMES.length)];
    const people: Party["people"] = [];
    while (people.length < size) {
      const name = `${FIRST_NAMES[Math.floor(next() * FIRST_NAMES.length)]} ${last}`;
      if (used.has(name)) {
        /* Every name taken in this family: give up on the rest of the party. */
        if (FIRST_NAMES.every((first) => used.has(`${first} ${last}`))) break;
        continue;
      }
      used.add(name);
      const age = people.length < 2 ? "adult" : next() < 0.6 ? "child" : "baby";
      people.push({ name, age });
    }
    if (people.length === 0) continue;
    parties.push({ people });
    left -= people.length;
  }
  return parties;
}

/** One party's reply: everyone coming, or everyone not. */
export function partyReply(
  party: Party,
  id: string,
  going: boolean,
  daysAgo: number,
  seed: number,
): SeedReply {
  const next = random(seed);
  return {
    id,
    sentAt: momentFromNow(-daysAgo),
    status: going ? "going" : "not_going",
    message: next() < 0.3 ? "Abia așteptăm!" : null,
    createdBy: "guest",
    people: party.people.map((person, index) => ({
      id: `${id}-p${index + 1}`,
      name: person.name,
      ...(going && {
        ageGroup: person.age,
        diet: DIETS[Math.floor(next() * DIETS.length)],
      }),
    })),
  };
}
