import type {
  AccessNeed,
  AgeGroup,
  DietNeed,
  GuestReply,
  NeedsPick,
} from "@/types/guests";

/*
 * The message keys that name a reply's status, age, diet and accessibility, in one place:
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

/** The age groups' plural names, heading the Summary's counts. */
export const AGE_SUMMARY_KEY = {
  adult: "summaryAdults",
  child: "summaryChildren",
  baby: "summaryBabies",
} as const satisfies Record<AgeGroup, string>;

export const DIET_KEY = {
  vegetarian: "dietVegetarian",
  vegan: "dietVegan",
  glutenFree: "dietGlutenFree",
  lactoseFree: "dietLactoseFree",
  nutAllergy: "dietNutAllergy",
  other: "dietOther",
} as const satisfies Record<DietNeed, string>;

export const ACCESS_KEY = {
  stepFree: "accessStepFree",
  walking: "accessWalking",
  hearing: "accessHearing",
  sight: "accessSight",
  other: "accessOther",
} as const satisfies Record<AccessNeed, string>;

/*
 * The age options every form offers, in the order they show, and the rule
 * that ties a needs question's picks together — shared by the host's reply
 * editor and the guest's RSVP form, so the two always match.
 */

export const AGES = Object.keys(AGE_KEY) as AgeGroup[];

/** None and the needs rule each other out; picking a picked one takes it back. */
export function pickNeeds(current: NeedsPick[], pick: NeedsPick): NeedsPick[] {
  if (current.includes(pick)) return current.filter((entry) => entry !== pick);
  if (pick === "none") return ["none"];
  return [...current.filter((entry) => entry !== "none"), pick];
}
