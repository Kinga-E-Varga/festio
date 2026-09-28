import type { RsvpStatus } from "@/types/invitation";

/*
 * Mock-only shapes for the host's guest list. Not a Firestore schema: that
 * is still unsettled, so ask before persisting any of this.
 */

/** A name on the host's pre-loaded list. */
export interface ListName {
  id: string;
  name: string;
  /** Whether the host has sent this person an invitation. */
  sent: boolean;
}

/** The age question every form asks, for each person coming. */
export type AgeGroup = "adult" | "child" | "baby";

/** The dietary presets every form offers, for each person coming; `other` comes with the guest's own words. */
export type DietNeed = "vegetarian" | "vegan" | "glutenFree" | "lactoseFree" | "nutAllergy" | "other";

/** Asked of each person coming, or once for the whole reply. */
export type QuestionScope = "person" | "reply";

interface QuestionBase {
  /** Permanent: answers are keyed by it. */
  id: string;
  /** The host's own wording, in the invitation's language. */
  label: string;
  scope: QuestionScope;
}

/** A host's custom question. Asked only of people coming. */
export type GuestQuestion =
  | (QuestionBase & { kind: "choice"; options: { id: string; label: string }[] })
  | (QuestionBase & { kind: "yesNo" })
  | (QuestionBase & { kind: "text" });

/** A choice's option id, a yes/no, or free text. */
export type AnswerValue = string | boolean;

/**
 * One attendee from one reply. A reply fans out into one of these per
 * person, all sharing its `submissionId`, with the note copied onto each.
 */
export interface GuestReply {
  id: string;
  submissionId: string;
  name: string;
  status: RsvpStatus;
  /** The reply's note to the host. Null = asked and skipped. */
  note: string | null;
  /* Asked only of people coming: missing = never asked, null = asked and skipped. */
  ageGroup?: AgeGroup | null;
  /** Empty = no needs. */
  diet?: DietNeed[] | null;
  /** What the guest wrote for `other`. */
  dietOther?: string;
  /**
   * Custom answers by question id: missing = never asked, null = asked and
   * skipped. A reply-wide answer is copied onto each person, like the note.
   */
  answers?: Record<string, AnswerValue | null>;
  /** When the reply came in, as a local ISO date-time. */
  repliedAt: string;
  /** The host confirmed this isn't the guest behind an earlier reply with the same name. */
  differentPerson: boolean;
  /** The list name the host matched this reply to by hand. */
  listNameId?: string;
}

export interface EventGuests {
  list: ListName[];
  replies: GuestReply[];
  /** The host's custom questions; empty when the form asks none. */
  questions: GuestQuestion[];
}

export type GuestRow =
  | {
      kind: "reply";
      id: string;
      reply: GuestReply;
      /** The list is on and the name isn't on it: the Unknown tag. */
      unlisted: boolean;
      /** Another reply the host hasn't told apart has the same name. */
      identical: boolean;
      /** Identical, and not the first reply with that name: it gets "Different person". */
      later: boolean;
    }
  | { kind: "waiting"; id: string; listName: ListName };

/** The table's blocks, in the order they show. */
export type GuestCategory = "attention" | "going" | "notGoing" | "waiting";

/** People who replied together, or one waiting name on its own. */
export interface GuestGroup {
  id: string;
  rows: GuestRow[];
  /** The reply's note, shown once for the group. */
  note: string | null;
  /** Split off from its reply: the names that stayed in the other part. */
  with: string[];
}

/** A card in the Needs attention section. */
export type AttentionItem =
  | { kind: "unknown"; id: string; group: GuestGroup }
  | {
      kind: "identical";
      id: string;
      name: string;
      /** Each reply's row with the name, oldest first. */
      entries: Extract<GuestRow, { kind: "reply" }>[];
    };

export type GuestFilter =
  | "all"
  | "going"
  | "not_going"
  | "waiting"
  | "notSent"
  | "attention";

export interface GuestCounts {
  going: number;
  notGoing: number;
  waiting: number;
  notSent: number;
  /** Rows to sort out: unknown names plus identical ones. */
  attention: number;
}

/** One custom question's answers, from the people (or replies) coming. */
export interface QuestionTally {
  question: GuestQuestion;
  /** By option id for a choice, `yes` / `no` for a yes/no. */
  answers: Record<string, number>;
  answered: number;
}

/** The Summary section's numbers. Age, diet and questions count people coming. */
export interface GuestTally {
  ages: Record<AgeGroup, number>;
  diets: Record<DietNeed, number>;
  questions: QuestionTally[];
  /** Replies that came with a note, once per reply. */
  messages: number;
}

export interface NameRepeat {
  name: string;
  count: number;
}

/** What a row editor hands back. Waiting names ignore `status`. */
export interface RowValues {
  name: string;
  status: RsvpStatus;
}
