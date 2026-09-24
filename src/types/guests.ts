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
  /** The guest chose "No, add mine" on a name that was already there. */
  duplicate: boolean;
  /** The list name the host matched this reply to by hand. */
  listNameId?: string;
}

export interface EventGuests {
  list: ListName[];
  replies: GuestReply[];
}

export type UnknownKind = "unmatched" | "duplicate";

export type GuestRow =
  | {
      kind: "reply";
      id: string;
      reply: GuestReply;
      unknown: UnknownKind | null;
      /** The list is on and the name isn't on it: the Unknown tag. */
      unlisted: boolean;
      /** Another reply came in under this name as a duplicate: the Duplicate tag. */
      repeated: boolean;
    }
  | { kind: "waiting"; id: string; listName: ListName };

/** The table's blocks, in the order they show. */
export type GuestCategory = "unknown" | "going" | "notGoing" | "waiting";

/** People who replied together, or one waiting name on its own. */
export interface GuestGroup {
  id: string;
  rows: GuestRow[];
  /** The reply's note, shown once for the group. */
  note: string | null;
  /** Split off from its reply: the names that stayed in the other part. */
  with: string[];
}

export type GuestFilter =
  | "all"
  | "going"
  | "not_going"
  | "waiting"
  | "notSent"
  | "unknown"
  | "duplicate";

export interface GuestCounts {
  going: number;
  notGoing: number;
  waiting: number;
  notSent: number;
  unknown: number;
  duplicate: number;
  unmatched: number;
  replied: number;
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
