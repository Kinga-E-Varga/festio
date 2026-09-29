import type { AgeGroup, DietNeed, GuestReply } from "@/types/guests";

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
