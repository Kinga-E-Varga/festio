import type { RsvpStatus } from "@/types/invitation";
import type { z } from "zod";
import type { Question, questionScopeSchema } from "@/db/schemas/event";
import type { listNameSchema } from "@/db/schemas/guest-list";
import type {
  ageGroupSchema,
  answerSchema,
  accessNeedSchema,
  dietNeedSchema,
} from "@/db/schemas/reply";

/*
 * The guest list as the pages read it, built from the reply and guest-list
 * cards (`src/db/reads/guests.ts`). View shapes, not the stored ones: a
 * reply's answers are copied onto each of its people here.
 */

/** A name on the host's pre-loaded list. */
export type ListName = z.infer<typeof listNameSchema>;

/** The age question every form asks, for each person coming. */
export type AgeGroup = z.infer<typeof ageGroupSchema>;

/** The dietary presets every form offers, for each person coming; `other` comes with the guest's own words. */
export type DietNeed = z.infer<typeof dietNeedSchema>;

/** The accessibility presets, for each person coming; `other` comes with the guest's own words. */
export type AccessNeed = z.infer<typeof accessNeedSchema>;

/** Asked of each person coming, or once for the whole reply. */
export type QuestionScope = z.infer<typeof questionScopeSchema>;

/** A host's own question, as the event card stores it. Asked only of people coming. */
export type GuestQuestion = Question;

/** A choice's option id, a yes/no, or free text. */
export type AnswerValue = NonNullable<z.infer<typeof answerSchema>>;

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
  /**
   * Answers by question id, age and diet included: missing = never asked,
   * null = asked and skipped. A reply-wide answer is copied onto each
   * person, like the note.
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
  /** The list card's version the page read; 0 before it is first saved. */
  listVersion: number;
  replies: GuestReply[];
  /** The form's questions, resolved: the suggested ones and the host's own. */
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

/** A flag on a reply needing the host: a name not on the list, or one an earlier reply sent. */
export type AttentionTag = "unknown" | "duplicate";

/** The table's blocks, in the order they show. */
export type GuestCategory = "attention" | "going" | "notGoing" | "waiting";

/** People who replied together, or one waiting name on its own. */
export interface GuestGroup {
  id: string;
  rows: GuestRow[];
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

export interface GuestCounts {
  going: number;
  notGoing: number;
  waiting: number;
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

/** The Summary section's numbers. Age, diet, accessibility and questions count people coming. */
export interface GuestTally {
  ages: Record<AgeGroup, number>;
  diets: Record<DietNeed, number>;
  access: Record<AccessNeed, number>;
  questions: QuestionTally[];
  /** Replies that came with a note, once per reply. */
  messages: number;
}

export interface NameRepeat {
  name: string;
  count: number;
}

/** A needs pick in the editor: an option id, or the reserved id `none` for no needs at all. */
export type NeedsPick = string;

/** One needs question's answer in a form: the picks, and Other's words. */
export interface NeedsValue {
  picks: NeedsPick[];
  other: string;
}

/**
 * One person in the reply editor. Empty strings and lists are unanswered;
 * answers are by question id: an option id, `yes` / `no`, or the text.
 */
export interface PersonValues {
  name: string;
  /** Needs answers by question id. */
  needs: Record<string, NeedsValue>;
  answers: Record<string, string>;
}

/** What the reply editor hands back: one status for everyone, and the reply-wide answers once. */
export interface ReplyValues {
  status: RsvpStatus;
  people: PersonValues[];
  shared: Record<string, string>;
}
