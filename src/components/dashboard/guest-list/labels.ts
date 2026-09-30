import type { AgeGroup, DietNeed, DietPick, GuestReply } from "@/types/guests";

/*
 * The message keys that name a reply's status, age and diet, in one place:
 * the rows, the editor and the summary name them the same way.
 */

export const STATUS_KEY = {
  going: "statusGoing",
  not_going: "statusNotGoing",
} as const satisfies Record<GuestReply["status"], string>;

export const AGE_KEY = {
  adult: "ageAdult",
  child: "ageChild",
  baby: "ageBaby",
} as const satisfies Record<AgeGroup, string>;

export const DIET_KEY = {
  vegetarian: "dietVegetarian",
  vegan: "dietVegan",
  glutenFree: "dietGlutenFree",
  lactoseFree: "dietLactoseFree",
  nutAllergy: "dietNutAllergy",
  other: "dietOther",
} as const satisfies Record<DietNeed, string>;

/*
 * The age and diet options every form offers, in the order they show, and
 * the rule that ties the diet picks together — shared by the host's reply
 * editor and the guest's RSVP form, so the two always match.
 */

export const AGES = Object.keys(AGE_KEY) as AgeGroup[];

/** None first: the most common answer, and the one that clears the rest. */
export const DIETS: DietPick[] = [
  "none",
  ...(Object.keys(DIET_KEY) as DietNeed[]),
];

/** None and the needs rule each other out; picking a picked one takes it back. */
export function pickDiet(current: DietPick[], pick: DietPick): DietPick[] {
  if (current.includes(pick)) return current.filter((entry) => entry !== pick);
  if (pick === "none") return ["none"];
  return [...current.filter((entry) => entry !== "none"), pick];
}
