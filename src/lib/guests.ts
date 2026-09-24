/**
 * The guest list as the host sees it: one row per person, built from the
 * pre-loaded names and the replies. Type imports only, so a plain Node
 * script can load this file.
 */
import type {
  EventGuests,
  GuestCategory,
  GuestCounts,
  GuestFilter,
  GuestGroup,
  GuestReply,
  GuestRow,
  ListName,
  NameRepeat,
  UnknownKind,
} from "@/types/guests";

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

function replyRow(reply: GuestReply, unknown: UnknownKind | null, unlisted = false): GuestRow {
  return { kind: "reply", id: reply.id, reply, unknown, unlisted, repeated: false };
}

/** Every reply sharing a name with a duplicate carries the Duplicate tag. */
function markRepeated(rows: GuestRow[]): GuestRow[] {
  const names = new Set(
    rows.flatMap((row) =>
      row.kind === "reply" && row.unknown === "duplicate" ? [normalizeName(row.reply.name)] : [],
    ),
  );
  return rows.map((row) =>
    row.kind === "reply" && names.has(normalizeName(row.reply.name)) ? { ...row, repeated: true } : row,
  );
}

/**
 * With the list on, each reply claims one list name: the host's own match
 * first, then an unclaimed name spelled the same. A reply that claims none
 * is unmatched; a name nobody claimed is Waiting. Duplicates never claim.
 */
export function buildRows(guests: EventGuests, useList: boolean): GuestRow[] {
  if (!useList) {
    return markRepeated(
      guests.replies.map((reply) => replyRow(reply, reply.duplicate ? "duplicate" : null)),
    );
  }

  const ids = new Set(guests.list.map((name) => name.id));
  const hostMatched = (reply: GuestReply) =>
    !reply.duplicate && reply.listNameId !== undefined && ids.has(reply.listNameId);
  const claimed = new Set(
    guests.replies.flatMap((reply) =>
      hostMatched(reply) && reply.listNameId ? [reply.listNameId] : [],
    ),
  );

  const listed = new Set(guests.list.map((name) => normalizeName(name.name)));
  const rows = guests.replies.map((reply) => {
    if (reply.duplicate) return replyRow(reply, "duplicate", !listed.has(normalizeName(reply.name)));
    if (hostMatched(reply)) return replyRow(reply, null);
    const key = normalizeName(reply.name);
    const match = guests.list.find(
      (name) => !claimed.has(name.id) && normalizeName(name.name) === key,
    );
    if (!match) return replyRow(reply, "unmatched", true);
    claimed.add(match.id);
    return replyRow(reply, null);
  });

  const waiting = guests.list
    .filter((name) => !claimed.has(name.id))
    .map((listName): GuestRow => ({ kind: "waiting", id: listName.id, listName }));

  return [...markRepeated(rows), ...waiting];
}

function hasUnknown(group: GuestGroup): boolean {
  return group.rows.some((row) => row.kind === "reply" && row.unknown !== null);
}

export const CATEGORIES: GuestCategory[] = ["unknown", "going", "notGoing", "waiting"];

function rowCategory(row: GuestRow): GuestCategory {
  if (row.kind === "waiting") return "waiting";
  if (row.unlisted) return "unknown";
  return row.reply.status === "going" ? "going" : "notGoing";
}

/** After the split every member shares one category; the first row tells it. */
export function groupCategory(group: GuestGroup): GuestCategory {
  return rowCategory(group.rows[0]);
}

/**
 * Categories work like filters: a reply whose people land in different
 * categories splits, one part per category. Each part names the rest in
 * "Replied with"; the note stays on the first part that isn't Unknown.
 * Once everyone lands in the same category, the reply is whole again.
 */
function splitByCategory(group: GuestGroup): GuestGroup[] {
  const parts = CATEGORIES.flatMap((category) => {
    const rows = group.rows.filter((row) => rowCategory(row) === category);
    return rows.length > 0 ? [{ category, rows }] : [];
  });
  if (parts.length === 1) return [group];
  const noteOn = parts.find((part) => part.category !== "unknown") ?? parts[0];
  return parts.map((part) => ({
    id: `${group.id}:${part.category}`,
    rows: part.rows,
    note: part === noteOn ? group.note : null,
    with: group.rows.filter((row) => !part.rows.includes(row)).map(rowName),
  }));
}

/** One group per reply, in the guest's order; unknown groups first, then A–Z. */
export function groupRows(
  rows: GuestRow[],
  compare: (first: string, second: string) => number,
): GuestGroup[] {
  const groups = new Map<string, GuestGroup>();
  for (const row of rows) {
    const id = row.kind === "reply" ? `reply:${row.reply.submissionId}` : `list:${row.id}`;
    const group = groups.get(id);
    if (group) group.rows.push(row);
    else groups.set(id, { id, rows: [row], note: row.kind === "reply" ? row.reply.note : null, with: [] });
  }
  return [...groups.values()].flatMap(splitByCategory).sort(
    (first, second) =>
      Number(hasUnknown(second)) - Number(hasUnknown(first)) ||
      compare(rowName(first.rows[0]), rowName(second.rows[0])),
  );
}

export function countRows(rows: GuestRow[]): GuestCounts {
  const counts: GuestCounts = {
    going: 0,
    notGoing: 0,
    waiting: 0,
    notSent: 0,
    unknown: 0,
    duplicate: 0,
    unmatched: 0,
    replied: 0,
  };
  for (const row of rows) {
    if (row.kind === "waiting") {
      counts.waiting += 1;
      if (!row.listName.sent) counts.notSent += 1;
      continue;
    }
    counts.replied += 1;
    if (row.reply.status === "going") counts.going += 1;
    else counts.notGoing += 1;
    if (row.unlisted) counts.unknown += 1;
    if (row.repeated) counts.duplicate += 1;
    if (row.unknown === "unmatched") counts.unmatched += 1;
  }
  return counts;
}

export function rowMatches(row: GuestRow, filter: GuestFilter, query: string): boolean {
  const needle = normalizeName(query);
  if (needle && !normalizeName(rowName(row)).includes(needle)) return false;
  switch (filter) {
    case "all":
      return true;
    case "going":
      return row.kind === "reply" && row.reply.status === "going";
    case "not_going":
      return row.kind === "reply" && row.reply.status === "not_going";
    case "waiting":
      return row.kind === "waiting";
    case "notSent":
      return row.kind === "waiting" && !row.listName.sent;
    case "unknown":
      return row.kind === "reply" && row.unlisted;
    case "duplicate":
      return row.kind === "reply" && row.repeated;
  }
}

/**
 * Only the members who pass stay, still together; the ones left out join the
 * "Replied with" names, the same way an unknown person splits off.
 */
export function filterGroup(group: GuestGroup, filter: GuestFilter, query: string): GuestGroup | null {
  const shown = group.rows.filter((row) => rowMatches(row, filter, query));
  if (shown.length === 0) return null;
  if (shown.length === group.rows.length) return group;
  const left = group.rows.filter((row) => !shown.includes(row)).map(rowName);
  return { ...group, rows: shown, with: [...group.with, ...left] };
}

/** A filter whose chip is no longer shown falls back to All. */
export function resolveFilter(
  filter: GuestFilter,
  counts: GuestCounts,
  useList: boolean,
): GuestFilter {
  if (filter === "waiting" && !useList) return "all";
  if (filter === "notSent" && !(useList && counts.notSent > 0)) return "all";
  if (filter === "unknown" && counts.unknown === 0) return "all";
  if (filter === "duplicate" && counts.duplicate === 0) return "all";
  return filter;
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
  const added = { ...guests, list: [...guests.list, { id: newId, name: reply.name, sent: true }] };
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
export function openRow(editing: string | null, rows: GuestRow[]): string | null {
  if (editing === null || editing === NEW_ROW) return editing;
  return rows.some((row) => row.id === editing) ? editing : null;
}

export function keepBoth(guests: EventGuests, replyId: string): EventGuests {
  return updateReply(guests, replyId, { duplicate: false });
}
