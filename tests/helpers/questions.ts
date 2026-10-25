import type { Question } from "@/db/schemas/event";

/*
 * The reply questions the answer tests share: a required yes/no and a text
 * asked once per reply, a choice asked of each person, and an archived one.
 */

const base = { required: false, archived: false, answered: false };

export const RIDE: Question = {
  ...base,
  id: "ride",
  label: "Ride?",
  scope: "reply",
  kind: "yesNo",
  required: true,
};

export const SONG: Question = {
  ...base,
  id: "song",
  label: "Song?",
  scope: "reply",
  kind: "text",
};

export const MEAL: Question = {
  ...base,
  id: "meal",
  label: "Meal",
  scope: "person",
  kind: "choice",
  options: [
    { id: "o1", label: "Fish" },
    { id: "o2", label: "Beef" },
  ],
};

export const OLD: Question = {
  ...base,
  id: "old",
  label: "Old",
  scope: "reply",
  kind: "text",
  archived: true,
  answered: true,
};

/** Each question's `answered`, by id. */
export function answeredById(questions: Question[]): Record<string, boolean> {
  return Object.fromEntries(
    questions.map(({ id, answered }): [string, boolean] => [id, answered]),
  );
}
