/**
 * The guest list as the host sees it: one row per person, built from the
 * pre-loaded names and the replies. No React or Firebase, so a plain Node
 * script (the seed) can load this file.
 */
import type { EventDoc } from "@/db/schemas/event";
import type { GuestChanges, ReplyInput } from "@/db/schemas/guest-changes";
import type { ReplyDoc } from "@/db/schemas/reply";
import { toDateTimeLocal } from "@/lib/event";
import type {
  AnswerValue,
  AttentionItem,
  EventGuests,
  GuestCategory,
  GuestCounts,
  GuestGroup,
  GuestQuestion,
  GuestReply,
  GuestRow,
  GuestTally,
  ListName,
  NameRepeat,
  QuestionTally,
} from "@/types/guests";

/** A reply card with the ID it is saved under. */
export type StoredReply = ReplyDoc & { id: string };

/**
 * Each person as the guest list's rows read them. The reply's answers are
 * stored once; the rows still carry them on every person, for now.
 */
export function toGuestReplies(replies: StoredReply[]): GuestReply[] {
  return replies.flatMap((reply) =>
    reply.people.map((person) => ({
      id: person.id,
      submissionId: reply.id,
      name: person.name,
      status: reply.status,
      note: reply.message,
      ageGroup: person.ageGroup,
      diet: person.diet,
      dietOther: person.dietOther,
      answers: { ...reply.answers, ...person.answers },
      repliedAt: toDateTimeLocal(reply.sentAt.toDate()),
      differentPerson: person.differentPerson ?? false,
      listNameId: person.listNameId,
    })),
  );
}

type Answers = Record<string, AnswerValue | null>;

/** The answers `keep` lets through, keys sorted so two copies compare as text; missing when none. */
function pickAnswers(
  answers: Answers | undefined,
  keep: (questionId: string) => boolean,
): Answers | undefined {
  const keys = Object.keys(answers ?? {})
    .filter(keep)
    .sort();
  if (!answers || keys.length === 0) return undefined;
  return Object.fromEntries(keys.map((key) => [key, answers[key]]));
}

/**
 * The rows back into reply cards, the way `toGuestReplies` read them: one
 * per `submissionId`, in order. A reply-wide answer is taken once, from the
 * first person; the rest stay with each person.
 */
export function fromGuestReplies(
  people: GuestReply[],
  questions: GuestQuestion[],
): ReplyInput[] {
  const perReply = new Set(
    questions.flatMap((question) =>
      question.scope === "reply" ? [question.id] : [],
    ),
  );
  const cards = new Map<string, ReplyInput>();
  for (const person of people) {
    const stored = {
      id: person.id,
      name: person.name,
      ageGroup: person.ageGroup,
      diet: person.diet,
      dietOther: person.dietOther,
      answers: pickAnswers(person.answers, (id) => !perReply.has(id)),
      listNameId: person.listNameId,
      differentPerson: person.differentPerson || undefined,
    };
    const card = cards.get(person.submissionId);
    if (card) card.people.push(stored);
    else
      cards.set(person.submissionId, {
        id: person.submissionId,
        isNew: false,
        status: person.status,
        message: person.note,
        answers: pickAnswers(person.answers, (id) => perReply.has(id)),
        people: [stored],
      });
  }
  return [...cards.values()];
}

/**
 * What a guest-list edit changed, as the save sends it: the reply cards that
 * are new or differ and the ones gone, and the whole list if any name
 * changed. A new card whose people all came from one card (Separate from
 * group) names it in `from`.
 */
export function guestChanges(
  before: EventGuests,
  after: EventGuests,
): GuestChanges {
  const old = new Map(
    fromGuestReplies(before.replies, before.questions).map((card) => [
      card.id,
      JSON.stringify(card),
    ]),
  );
  const cards = fromGuestReplies(after.replies, after.questions);
  const cameFrom = new Map(
    before.replies.map((person) => [person.id, person.submissionId]),
  );
  const put = cards.flatMap((card): ReplyInput[] => {
    const was = old.get(card.id);
    if (was !== undefined) return was === JSON.stringify(card) ? [] : [card];
    const sources = new Set(
      card.people.map((person) => cameFrom.get(person.id)),
    );
    const [from] = sources;
    const added = { ...card, isNew: true };
    return [
      sources.size === 1 && from !== undefined ? { ...added, from } : added,
    ];
  });
  const kept = new Set(cards.map((card) => card.id));

  const listChanged =
    JSON.stringify(before.list) !== JSON.stringify(after.list);
  return {
    replies: { put, remove: [...old.keys()].filter((id) => !kept.has(id)) },
    list: listChanged
      ? { names: after.list, version: before.listVersion }
      : null,
  };
}

/** Whether a save would send anything at all. */
export function hasChanges(changes: GuestChanges): boolean {
  return (
    changes.replies.put.length > 0 ||
    changes.replies.remove.length > 0 ||
    changes.list !== null
  );
}

/** Case, accents and spacing never make two names different people. */
export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/** One name per line; a spreadsheet row's cells join with a space. */
export function parseNames(text: string): string[] {
  return text
    .split(/\r\n?|\n/)
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter(Boolean);
}

export function rowName(row: GuestRow): string {
  return row.kind === "reply" ? row.reply.name : row.listName.name;
}

function replyRow(reply: GuestReply, unlisted: boolean): GuestRow {
  return {
    kind: "reply",
    id: reply.id,
    reply,
    unlisted,
    identical: false,
    later: false,
  };
}

/**
 * Replies sharing a name are identical until the host marks the later ones
 * as a different person. The first in reply order is never "later".
 */
function markIdentical(rows: GuestRow[]): GuestRow[] {
  const byName = new Map<string, string[]>();
  for (const row of rows) {
    if (row.kind !== "reply" || row.reply.differentPerson) continue;
    const key = normalizeName(row.reply.name);
    byName.set(key, [...(byName.get(key) ?? []), row.id]);
  }
  return rows.map((row) => {
    if (row.kind !== "reply") return row;
    const ids = byName.get(normalizeName(row.reply.name)) ?? [];
    if (ids.length < 2 || !ids.includes(row.id)) return row;
    return { ...row, identical: true, later: ids[0] !== row.id };
  });
}

/**
 * With the list on, each reply claims one list name: the host's own match
 * first, then an unclaimed name spelled the same. A reply that claims none
 * is unlisted; a name nobody claimed is Waiting. Replies claim in reply
 * order, so a later reply with the same name finds its name taken.
 */
export function buildRows(
  guests: Pick<EventGuests, "list" | "replies" | "questions">,
  useList: boolean,
): GuestRow[] {
  if (!useList)
    return markIdentical(guests.replies.map((reply) => replyRow(reply, false)));

  const ids = new Set(guests.list.map((name) => name.id));
  const hostMatched = (reply: GuestReply) =>
    reply.listNameId !== undefined && ids.has(reply.listNameId);
  const claimed = new Set(
    guests.replies.flatMap((reply) =>
      hostMatched(reply) && reply.listNameId ? [reply.listNameId] : [],
    ),
  );

  const rows = guests.replies.map((reply) => {
    if (hostMatched(reply)) return replyRow(reply, false);
    const key = normalizeName(reply.name);
    const match = guests.list.find(
      (name) => !claimed.has(name.id) && normalizeName(name.name) === key,
    );
    if (!match) return replyRow(reply, true);
    claimed.add(match.id);
    return replyRow(reply, false);
  });

  const waiting = guests.list
    .filter((name) => !claimed.has(name.id))
    .map((listName): GuestRow => ({
      kind: "waiting",
      id: listName.id,
      listName,
    }));

  return [...markIdentical(rows), ...waiting];
}

/** Something for the host to sort out: an unknown name, or one shared with another reply. */
export function needsAttention(row: GuestRow): boolean {
  return row.kind === "reply" && (row.identical || row.unlisted);
}

/** The Unknown tag and its fixes wait until an identical name is told apart. */
export function showsUnknown(row: GuestRow): boolean {
  return row.kind === "reply" && row.unlisted && !row.identical;
}

export const CATEGORIES: GuestCategory[] = [
  "attention",
  "going",
  "notGoing",
  "waiting",
];

function rowCategory(row: GuestRow): GuestCategory {
  if (row.kind === "waiting") return "waiting";
  if (needsAttention(row)) return "attention";
  return row.reply.status === "going" ? "going" : "notGoing";
}

/** After the split every member shares one category; the first row tells it. */
export function groupCategory(group: GuestGroup): GuestCategory {
  return rowCategory(group.rows[0]);
}

/**
 * Categories work like filters: a reply whose people land in different
 * categories splits, one part per category. Each part names the rest in
 * "Replied with". Once everyone lands in the same category, the reply is
 * whole again.
 */
function splitByCategory(group: GuestGroup): GuestGroup[] {
  const parts = CATEGORIES.flatMap((category) => {
    const rows = group.rows.filter((row) => rowCategory(row) === category);
    return rows.length > 0 ? [{ category, rows }] : [];
  });
  if (parts.length === 1) return [group];
  return parts.map((part) => ({
    id: `${group.id}:${part.category}`,
    rows: part.rows,
    with: group.rows.filter((row) => !part.rows.includes(row)).map(rowName),
  }));
}

/** One group per reply, in the guest's order; A–Z by the first name in it. */
export function groupRows(
  rows: GuestRow[],
  compare: (first: string, second: string) => number,
): GuestGroup[] {
  const groups = new Map<string, GuestGroup>();
  for (const row of rows) {
    const id =
      row.kind === "reply"
        ? `reply:${row.reply.submissionId}`
        : `list:${row.id}`;
    const group = groups.get(id);
    if (group) group.rows.push(row);
    else groups.set(id, { id, rows: [row], with: [] });
  }
  return [...groups.values()]
    .flatMap(splitByCategory)
    .sort((first, second) =>
      compare(rowName(first.rows[0]), rowName(second.rows[0])),
    );
}

/**
 * The Needs attention section's cards: replies sharing a name side by side,
 * oldest first, and each unknown reply on its own. Shared names come first:
 * they're sorted out before an unknown name can be.
 */
export function attentionItems(groups: GuestGroup[]): AttentionItem[] {
  const items: AttentionItem[] = [];
  const byName = new Map<
    string,
    Extract<AttentionItem, { kind: "identical" }>
  >();
  for (const group of groups) {
    const rest = group.rows.filter(
      (row) => row.kind !== "reply" || !row.identical,
    );
    if (rest.length > 0) {
      const part =
        rest.length === group.rows.length
          ? group
          : { ...group, id: `${group.id}:unknown`, rows: rest };
      items.push({ kind: "unknown", id: part.id, group: part });
    }
    for (const row of group.rows) {
      if (row.kind !== "reply" || !row.identical) continue;
      const key = normalizeName(row.reply.name);
      const item = byName.get(key);
      if (item) item.entries.push(row);
      else {
        const created = {
          kind: "identical" as const,
          id: `same:${key}`,
          name: row.reply.name,
          entries: [row],
        };
        byName.set(key, created);
        items.push(created);
      }
    }
  }
  for (const item of byName.values()) {
    item.entries.sort((first, second) =>
      first.reply.repliedAt.localeCompare(second.reply.repliedAt),
    );
  }
  return [
    ...items.filter((item) => item.kind === "identical"),
    ...items.filter((item) => item.kind === "unknown"),
  ];
}

export function countRows(rows: GuestRow[]): GuestCounts {
  const counts: GuestCounts = {
    going: 0,
    notGoing: 0,
    waiting: 0,
    attention: 0,
  };
  for (const row of rows) {
    if (row.kind === "waiting") {
      counts.waiting += 1;
      continue;
    }
    if (row.reply.status === "going") counts.going += 1;
    else counts.notGoing += 1;
    if (needsAttention(row)) counts.attention += 1;
  }
  return counts;
}

/** A choice counts by option id, a yes/no as `yes` / `no`, free text only as answered. */
function tallyQuestion(
  question: GuestQuestion,
  replies: GuestReply[],
): QuestionTally {
  const tally: QuestionTally = { question, answers: {}, answered: 0 };
  for (const reply of replies) {
    /* Never asked or skipped: nothing to count. */
    const value = reply.answers?.[question.id];
    if (value === undefined || value === null || value === "") continue;
    tally.answered += 1;
    if (question.kind === "text") continue;
    const key =
      question.kind === "yesNo" ? (value ? "yes" : "no") : String(value);
    tally.answers[key] = (tally.answers[key] ?? 0) + 1;
  }
  return tally;
}

/**
 * The Summary section's numbers. Age, diet and custom answers come from the
 * people coming; a reply-wide question counts each reply once, as does a note.
 */
export function tallyGuests(
  rows: GuestRow[],
  questions: GuestQuestion[],
): GuestTally {
  const replies = rows.flatMap((row) =>
    row.kind === "reply" ? [row.reply] : [],
  );
  const coming = replies.filter((reply) => reply.status === "going");
  const onePerReply = (list: GuestReply[]) => [
    ...new Map(list.map((reply) => [reply.submissionId, reply])).values(),
  ];

  const tally: GuestTally = {
    ages: { adult: 0, child: 0, baby: 0 },
    diets: {
      vegetarian: 0,
      vegan: 0,
      glutenFree: 0,
      lactoseFree: 0,
      nutAllergy: 0,
      other: 0,
    },
    questions: [],
    messages: onePerReply(replies.filter((reply) => reply.note?.trim())).length,
  };
  for (const reply of coming) {
    if (reply.ageGroup) tally.ages[reply.ageGroup] += 1;
    for (const need of reply.diet ?? []) tally.diets[need] += 1;
  }
  const perReply = onePerReply(coming);
  tally.questions = questions.map((question) =>
    tallyQuestion(question, question.scope === "reply" ? perReply : coming),
  );
  return tally;
}

/** The people coming who answered at least one of the host's own questions. */
export function answeredCustom(rows: GuestRow[]): number {
  return rows.filter(
    (row) =>
      row.kind === "reply" &&
      row.reply.status === "going" &&
      Object.values(row.reply.answers ?? {}).some((answer) => answer !== null),
  ).length;
}

export function rowMatches(row: GuestRow, query: string): boolean {
  const needle = normalizeName(query);
  return !needle || normalizeName(rowName(row)).includes(needle);
}

/**
 * Only the members who pass stay, still together; the ones left out join the
 * "Replied with" names, the same way an unknown person splits off. `keep`
 * stays shown whatever the search: the row open in the editor.
 */
export function filterGroup(
  group: GuestGroup,
  query: string,
  keep: string | null = null,
): GuestGroup | null {
  const shown = group.rows.filter(
    (row) => row.id === keep || rowMatches(row, query),
  );
  if (shown.length === 0) return null;
  if (shown.length === group.rows.length) return group;
  const left = group.rows.filter((row) => !shown.includes(row)).map(rowName);
  return { ...group, rows: shown, with: [...group.with, ...left] };
}

/** Names about to be added that appear more than once, counting the list. */
export function findRepeats(names: string[], list: ListName[]): NameRepeat[] {
  const seen = new Map<string, NameRepeat>();
  for (const name of [...list.map((entry) => entry.name), ...names]) {
    const key = normalizeName(name);
    const entry = seen.get(key);
    if (entry) entry.count += 1;
    else seen.set(key, { name, count: 1 });
  }
  const pasted = new Set(names.map(normalizeName));
  return [...seen.entries()]
    .filter(([key, entry]) => entry.count > 1 && pasted.has(key))
    .map(([, entry]) => entry);
}

function updateReply(
  guests: EventGuests,
  replyId: string,
  patch: Partial<GuestReply>,
): EventGuests {
  return {
    ...guests,
    replies: guests.replies.map((reply) =>
      reply.id === replyId ? { ...reply, ...patch } : reply,
    ),
  };
}

/** The reply takes the list name's spelling, and holds it. */
export function matchReply(
  guests: EventGuests,
  replyId: string,
  listNameId: string,
): EventGuests {
  const listName = guests.list.find((name) => name.id === listNameId);
  if (!listName) return guests;
  return updateReply(guests, replyId, { name: listName.name, listNameId });
}

/** The unmatched reply's name joins the list, already claimed by it. */
export function addReplyToList(
  guests: EventGuests,
  replyId: string,
  newId: string,
): EventGuests {
  const reply = guests.replies.find((entry) => entry.id === replyId);
  if (!reply) return guests;
  const added = {
    ...guests,
    list: [...guests.list, { id: newId, name: reply.name, sent: true }],
  };
  return updateReply(added, replyId, { listNameId: newId });
}

/**
 * New replies go last: matching runs in reply order, so a reply that already
 * holds a name keeps it against a newcomer spelled the same.
 */
export function addReply(guests: EventGuests, reply: GuestReply): EventGuests {
  return { ...guests, replies: [...guests.replies, reply] };
}

/** The id of the blank row "Add guest" opens. */
export const NEW_ROW = "new";

/**
 * The row still in edit mode, or null once it is no longer shown: a match
 * or the list toggle can take a Waiting row away mid-edit.
 */
export function openRow(
  editing: string | null,
  rows: GuestRow[],
): string | null {
  if (editing === null || editing === NEW_ROW) return editing;
  return rows.some((row) => row.id === editing) ? editing : null;
}

/**
 * The person moves to a reply of their own (`submissionId`): they keep their
 * copy of the reply-wide answers, the others keep theirs, and the message
 * stays with the others, so it shows and counts once.
 */
export function separateReply(
  guests: EventGuests,
  replyId: string,
  submissionId: string,
): EventGuests {
  return updateReply(guests, replyId, { submissionId, note: null });
}

export function markDifferent(
  guests: EventGuests,
  replyId: string,
): EventGuests {
  return updateReply(guests, replyId, { differentPerson: true });
}

/** The event card's counters. */
export type EventCounts = EventDoc["counts"];

/**
 * The counters the event card keeps, worked out from the cards. The one
 * place they are counted: every save that changes replies, the seed and the
 * guest list's recount all call it.
 */
export function eventCounts(input: {
  replies: GuestReply[];
  list: ListName[];
  preloaded: boolean;
  questions: GuestQuestion[];
  seatedIds: string[];
}): EventCounts {
  const { replies, list, preloaded, questions, seatedIds } = input;
  const rows = buildRows({ list, replies, questions }, preloaded);
  const { going, notGoing, attention } = countRows(rows);
  const coming = new Set(
    replies.filter((person) => person.status === "going").map(({ id }) => id),
  );
  return {
    coming: going,
    notComing: notGoing,
    needsAttention: attention,
    /* Seated but not coming (or gone). */
    seatingWarnings: seatedIds.filter((id) => !coming.has(id)).length,
  };
}
